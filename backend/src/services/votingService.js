const db = require('../config/database');
const { addWallet } = require('./walletService');

/**
 * Calculate winners for each voting category.
 * @param {string} sessionId
 * @returns {Promise<object>} Map of category -> winner_id
 */
async function resolveCategoryWinners(sessionId) {
  const categories = ['best_gas', 'fan_favorite', 'next_picker'];
  const results = {};

  for (const cat of categories) {
    const winner = await db('votes')
      .select('target_id', db.raw('SUM(weight) as total'))
      .where({ session_id: sessionId, category: cat })
      .groupBy('target_id')
      .orderBy('total', 'desc')
      .first();
    if (winner) {
      results[cat] = winner.target_id;
      // Award R50 wallet credit
      await addWallet(winner.target_id, 50, 'vote_prize', sessionId);
      // Increment stats_dates_won (reuse for award count)
      await db('users').where({ id: winner.target_id }).increment('stats_dates_won', 1);
    }
  }
  return results;
}

/**
 * Process prediction votes: give bonus to correct predictors.
 * @param {string} sessionId
 * @param {string} actualWinnerId
 */
async function rewardCorrectPredictors(sessionId, actualWinnerId) {
  const correctPredictors = await db('votes')
    .select('voter_id')
    .where({ session_id: sessionId, category: 'prediction', target_id: actualWinnerId });
  for (const p of correctPredictors) {
    // Give a badge (increment a custom stat) – e.g., stats_gas_thrown used as "prophet count"
    await db('users').where({ id: p.voter_id }).increment('stats_gas_thrown', 1);
    // Could also add to a monthly draw table
  }
}

module.exports = { resolveCategoryWinners, rewardCorrectPredictors };
