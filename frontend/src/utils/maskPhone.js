export const maskPhone = (phone) => {

    // Determine how many digits to hide (keeping the last 4 visible)
    const hiddenDigits = phone.length - 4;

    // Create a masked phone number by replacing most digits with asterisks
    const maskedPhoneNumber = '*'.repeat(hiddenDigits) + phone.slice(hiddenDigits);

    return maskedPhoneNumber;
}