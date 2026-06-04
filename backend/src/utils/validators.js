/**
 * Validate email format.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  return re.test(email);
}

/**
 * Validate South African phone number (basic).
 * @param {string} phone
 * @returns {boolean}
 */
function isValidPhone(phone) {
  const re = /^(\+27|0)[6-8][0-9]{8}$/;
  return re.test(phone);
}

/**
 * Validate URL.
 * @param {string} url
 * @returns {boolean}
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate that a value is within a range.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
function isInRange(value, min, max) {
  return typeof value === 'number' && value >= min && value <= max;
}

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isInRange,
};
