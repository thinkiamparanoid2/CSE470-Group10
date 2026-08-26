/**
 * Server-Side Input Validation & Sanitization Helpers
 * Used by controllers to validate form data before database operations.
 * No external dependencies — pure JavaScript.
 */

// Check if a value is present and not empty
function isRequired(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim().length === 0) return false;
    return true;
}

// Check if value is a valid positive number
function isPositiveNumber(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0;
}

// Check if value is a valid integer >= 0
function isNonNegativeInt(value) {
    const num = parseInt(value, 10);
    return !isNaN(num) && num >= 0 && Number.isInteger(num);
}

// Check email format (basic regex)
function isValidEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

// Check if value is a valid date string (YYYY-MM-DD)
function isValidDate(dateStr) {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d instanceof Date && !isNaN(d.getTime());
}

// Check if string length is within range
function isLengthValid(value, min, max) {
    if (!value) return min === 0;
    const len = value.trim().length;
    return len >= min && len <= max;
}

// Check if a number is within a range
function isInRange(value, min, max) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
}

// Sanitize string input (trim whitespace, remove script tags)
function sanitize(value) {
    if (!value || typeof value !== 'string') return value;
    return value.trim().replace(/<script[^>]*>.*?<\/script>/gi, '').replace(/<[^>]*>/g, '');
}

/**
 * Validate multiple fields at once.
 * @param {Object} fields - { fieldName: value }
 * @param {Object} rules  - { fieldName: { required, type, min, max, minLen, maxLen, email, date } }
 * @returns {string[]} Array of error messages (empty = valid)
 * 
 * Example:
 *   const errors = validateFields(
 *     { name: req.body.name, email: req.body.email, stock: req.body.current_stock },
 *     { name: { required: true, minLen: 2, maxLen: 100 },
 *       email: { required: true, email: true },
 *       stock: { required: true, type: 'number', min: 0 } }
 *   );
 */
function validateFields(fields, rules) {
    const errors = [];

    for (const [fieldName, rule] of Object.entries(rules)) {
        const value = fields[fieldName];
        const label = rule.label || fieldName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

        if (rule.required && !isRequired(value)) {
            errors.push(`${label} is required.`);
            continue; // Skip further checks if missing
        }

        // Skip optional empty fields
        if (!isRequired(value)) continue;

        if (rule.email && !isValidEmail(value)) {
            errors.push(`${label} must be a valid email address.`);
        }

        if (rule.date && !isValidDate(value)) {
            errors.push(`${label} must be a valid date.`);
        }

        if (rule.type === 'number' && !isPositiveNumber(value)) {
            errors.push(`${label} must be a valid positive number.`);
        }

        if (rule.type === 'integer' && !isNonNegativeInt(value)) {
            errors.push(`${label} must be a valid whole number.`);
        }

        if (rule.min !== undefined && parseFloat(value) < rule.min) {
            errors.push(`${label} must be at least ${rule.min}.`);
        }

        if (rule.max !== undefined && parseFloat(value) > rule.max) {
            errors.push(`${label} must not exceed ${rule.max}.`);
        }

        if (rule.minLen !== undefined && !isLengthValid(value, rule.minLen, Infinity)) {
            errors.push(`${label} must be at least ${rule.minLen} characters.`);
        }

        if (rule.maxLen !== undefined && !isLengthValid(value, 0, rule.maxLen)) {
            errors.push(`${label} must not exceed ${rule.maxLen} characters.`);
        }
    }

    return errors;
}

module.exports = {
    isRequired,
    isPositiveNumber,
    isNonNegativeInt,
    isValidEmail,
    isValidDate,
    isLengthValid,
    isInRange,
    sanitize,
    validateFields
};
