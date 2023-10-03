const generateOtp = async () => {
    const otp = await `${Math.floor(1000 + (Math.random() * 9000))}`;
    return otp;
}

module.exports = generateOtp;