// Function to generate a random four-digit OTP
const generateOtp = async () => {
    // Generate a random number between 1000 and 9999, inclusive
    const otp = await `${Math.floor(1000 + (Math.random() * 9000))}`;

    // Return the OTP as a string
    return otp;
}

// Export the generateOtp function for use in other modules
module.exports = generateOtp;