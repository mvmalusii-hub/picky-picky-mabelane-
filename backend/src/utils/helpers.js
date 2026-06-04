/**
 * Generate a random 6-digit OTP.
 * @returns {string}
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Sleep for ms milliseconds.
 * @param {number} ms
 * @returns {Promise}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Truncate a string to a maximum length.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
function truncate(str, maxLength = 50) {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

/**
 * Format a date to ISO string without milliseconds.
 * @param {Date} date
 * @returns {string}
 */
function formatISODate(date) {
  return date.toISOString().split('.')[0] + 'Z';
}

module.exports = { generateOTP, sleep, truncate, formatISODate };
