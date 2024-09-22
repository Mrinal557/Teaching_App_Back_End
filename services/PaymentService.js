// services/paymentService.js
const initiatePayment = async (amount, upiId) =>
{
    upiId = "mrinal.annand@okhdfcbank";
    const name = "Mrinal Anand";
    const currency = "INR";
    
    return `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=${currency}`;
};

const verifyPayment = async (paymentId) =>
{
    try {
        // Replace with actual payment gateway verification API
        const response = await axios.post('https://your-payment-gateway.com/verify', { paymentId });

        return response.data.success;
    } catch (error) {
        console.error('Error verifying payment:', error);
        return false;
    }
};

module.exports = { initiatePayment, verifyPayment };
