export function validatePasswordStrength(password) {
    if (!password || password.length < 8) {
        return "Password must be at least 8 characters."
    }

    if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter."
    }

    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter."
    }

    if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number."
    }

    if (!/[!@#$%^&*(),.{}|<>]/.test(password)) {
        return "Password must contain at least one special character."
    }
    
    if (/^(.)\1+$/.test(password)) {
        return "Password can't be all the same character."
    }
    
    return null
}