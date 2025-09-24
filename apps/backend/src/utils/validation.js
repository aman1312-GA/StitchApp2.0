import validator from 'validator'

export const validateRegisterInput = (input) => {
    const errors = {};

    // email validation
    if (!input.email) {
        errors.email = "Email is required"
    }
    else if (!validator.isEmail(input.email)) {
        errors.email = "Email is invalid"
    }

    // password validation
    if (!input.password) {
        errors.password = "Password is required"
    }
    else if (input.password.length < 6) {
        errors.password = "Password must be at least 6 characters"
    }

    // name validation
    if (!input.fullName || input.fullName.trim().length < 3) {
        errors.fullName = "Name must be at least 3 characters"
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
}

export const validateLoginInput = (input) => {
    const errors = {};

    if (!input.email) {
        errors.email = "Email is required"
    }
    else if (!validator.isEmail(input.email)) {
        errors.email = "Email is invalid"
    }

    if (!input.password) {
        errors.password = "Password is required"
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
}