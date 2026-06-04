const db = require('../config/database');

/**
 * Deduct amount from user's wallet and record transaction.
 * @param {string} userId - UUID of user
 * @param {number} amount - Amount to deduct (positive integer)
 * @param {string} type - Transaction type (session_fee, shop_purchase, fine, prediction_fee)
 * @param {string} referenceId - Related ID (session_id, purchase_id, fine_id)
 * @returns {number|null} New wallet balance, or null if insufficient funds
 */
async function deductWallet(userId, amount, type, referenceId) {
  const user = await db('users').where({ id: userId }).first();
  if (!user || user.wallet_balance < amount) return null;
  const newBalance = user.wallet_balance - amount;
  await db('users').where({ id: userId }).update({ wallet_balance: newBalance });
  await db('transactions').insert({
    user_id: userId,
    amount: -amount,
    type,
    reference_id: referenceId,
  });
  return newBalance;
}

/**
 * Add amount to user's wallet and record transaction.
 * @param {string} userId - UUID of user
 * @param {number} amount - Amount to add
 * @param {string} type - Transaction type (winner_prize, vote_prize, refund)
 * @param {string} referenceId - Related ID
 */
async function addWallet(userId, amount, type, referenceId) {
  await db('users').where({ id: userId }).increment('wallet_balance', amount);
  await db('transactions').insert({
    user_id: userId,
    amount,
    type,
    reference_id: referenceId,
  });
}

/**
 * Get current wallet balance.
 * @param {string} userId
 * @returns {Promise<number>}
 */
async function getBalance(userId) {
  const user = await db('users').select('wallet_balance').where({ id: userId }).first();
  return user ? user.wallet_balance : 0;
}

module.exports = { deductWallet, addWallet, getBalance };
