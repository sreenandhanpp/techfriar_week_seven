export const maskEmail = ( email ) => {
        // Split the email address into username and domain
        const [username, domain] = email.split('@');
        // Determine how many characters to hide
        const hiddenCharacters = username.length - 3; // Keep the first 3 characters visible
        // Create a masked username 
        const maskedUsername = '*'.repeat(hiddenCharacters) + username.slice(hiddenCharacters);
        // Combine the masked username and domain to form the masked email
        const maskedEmail = maskedUsername + '@' + domain;
        
        return maskedEmail;
}