// controllers/subscriptionController.js
const User = require('../models/User');
const Lecture = require('../models/Lecture');
const TestSeries = require('../models/TestSeries');
const { initiatePayment, verifyPayment } = require('../services/PaymentService');

const calculatePrice = async (subject, section) =>
{
    let contentCount = 0, price = 0;
    if (section === 'videoLectures')
    {
        contentCount = await Lecture.countDocuments({ subject });
        price = contentCount * 1;
    } else if (section === 'testSeries')
    {
        contentCount = await TestSeries.countDocuments({ subject });
        price = contentCount * 150;
    }
    return price;
};

const handlePaymentCallback = async (req, res) => {
    const { paymentId, userId, subject, section } = req.body;

    try {
        const isValid = await verifyPayment(paymentId);

        if (isValid) {
            const user = await User.findById(userId);

            if (!user.subscriptions[subject]) {
                user.subscriptions[subject] = {};
            }
            user.subscriptions[subject][section] = true;

            user.payments.push({
                subject,
                section,
                amount: await calculatePrice(subject, section),
            });

            await user.save();

            res.status(200).json({ message: 'Subscription created successfully' });
        } else {
            res.status(400).json({ message: 'Payment verification failed' });
        }
    } catch (err) {
        console.error('Error handling payment callback:', error);
        res.status(500).json({ message: 'Error handling payment callback' });
    }
};

const getSubscriptions = async (req, res) => {
    const user = req.user;

    // Define the default structure for subscriptions
    const defaultSubscriptions = {
        "physicalChemistry": { videoLectures: false, testSeries: false },
        "inorganicChemistry": { videoLectures: false, testSeries: false },
        "organicChemistry": { videoLectures: false, testSeries: false },
    };

    try {
        // Retrieve user subscriptions or use default structure
        const userSubscriptions = user.subscriptions || {};

        // Merge userSubscriptions with defaultSubscriptions
        const mergedSubscriptions = {
            ...defaultSubscriptions,
            ...userSubscriptions
        };

        // Ensure all sections are present for each subject
        Object.keys(defaultSubscriptions).forEach(subject => {
            if (!mergedSubscriptions[subject]) {
                mergedSubscriptions[subject] = defaultSubscriptions[subject];
            } else {
                // Ensure both sections are present
                Object.keys(defaultSubscriptions[subject]).forEach(section => {
                    if (typeof mergedSubscriptions[subject][section] === 'undefined') {
                        mergedSubscriptions[subject][section] = false;
                    }
                });
            }
        });

        res.status(200).json(mergedSubscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ message: 'Error fetching subscriptions' });
    }
};


module.exports = { handlePaymentCallback, getSubscriptions };
