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

// Format a Date (or MySQL DATE value, or omitted for "today") as YYYY-MM-DD using
// LOCAL calendar components. Do NOT use `date.toISOString().split('T')[0]` for this
// anywhere in the app: toISOString() converts to UTC first, which silently shifts
// the date backward by a day for any server running east of UTC (e.g. Asia/Dhaka,
// UTC+6) whenever the local time is 00:00–06:00, or for ANY DATE column value
// mysql2 hands back as a Date object at local midnight. That bug bit real code
// here: a milestone's stored due date of 2026-03-30 was rendering as 2026-03-29 in
// edit forms, and a site report's "today" cutoff was querying the wrong day's
// labor/waste/request data whenever this ran in the early-morning window.
function toDateInputValue(date) {
    const d = date ? (date instanceof Date ? date : new Date(date)) : new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Check if value is a valid calendar date string (YYYY-MM-DD, as submitted by
// every <input type="date"> in this app). JavaScript's Date constructor silently
// rolls over impossible dates (e.g. "2026-02-30" becomes March 2nd) instead of
// rejecting them, so a naive `new Date(str)` check would let nonsense dates
// through. This parses the components and verifies they round-trip exactly.
function isValidDate(dateStr) {
    if (!dateStr) return false;
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateStr).trim());
    if (!match) return false;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const d = new Date(year, month - 1, day);
    return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
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
    toDateInputValue,
    validateFields
};
