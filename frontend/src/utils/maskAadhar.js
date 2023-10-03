export const maskAadhar = (aadhar) => {
    const maskedAadhar = 'XXXX XXXX XXXX ' + aadhar.slice(-4);
    return maskedAadhar;
}
