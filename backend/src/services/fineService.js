const db = require('../config/database');
const { deductWallet } = require('./walletService');

const FINE_AMOUNT = 100;
const BAN_DAYS = 3;

/**
 * Apply a fine to a contestant for a Gas Card violation.
 * @param {string} userId - Contestant to be fined
 * @param {string} sessionId - Session where violation occurred
 * @param {string} reason - Reason for fine
 * @returns {Promise<object>} { newBalance, banExpires }
 */
async function applyFine(userId, sessionId, reason) {
  // Deduct R100 from wallet
  const newBalance = await deductWallet(userId, FINE_AMOUNT, 'fine', sessionId);
  if (newBalance === null) {
    throw new Error('Insufficient funds for fine');
  }

  // Record fine
  await db('fines').insert({
    user_id: userId,
    amount: FINE_AMOUNT,
    reason,
    paid: true,
  });

  // Apply 3-day ban
  const banExpires = new Date(Date.now() + BAN_DAYS * 24 * 60 * 60 * 1000);
  await db('users').where({ id: userId }).update({ ban_expires: banExpires });

  // Update user stats
  await db('users').where({ id: userId }).increment('stats_fines_paid', FINE_AMOUNT);

  return { newBalance, banExpires };
}

/**
 * Check if a user is currently banned.
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
async function isBanned(userId) {
  const user = await db('users').select('ban_expires').where({ id: userId }).first();
  if (!user || !user.ban_expires) return false;
  return new Date(user.ban_expires) > new Date();
}

module.exports = { applyFine, isBanned, FINE_AMOUNT, BAN_DAYS };
