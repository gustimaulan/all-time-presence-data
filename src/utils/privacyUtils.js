/**
 * Masks an email address for privacy.
 * Example: "john.doe@gmail.com" -> "jo****oe@gmail.com"
 * @param {string} email 
 * @returns {string}
 */
export const maskEmail = (email) => {
    if (!email || !email.includes('@')) return email

    const [localPart, domain] = email.split('@')

    if (localPart.length <= 2) {
        return `${localPart.charAt(0)}****@${domain}`
    }

    if (localPart.length <= 4) {
        return `${localPart.charAt(0)}****${localPart.charAt(localPart.length - 1)}@${domain}`
    }

    const front = localPart.substring(0, 2)
    const back = localPart.substring(localPart.length - 2)

    return `${front}****${back}@${domain}`
}
