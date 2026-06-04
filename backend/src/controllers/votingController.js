const db = require('../config/database');
const { addWallet } = require('../services/walletService');

exports.submitVote = async (req, res, next) => {
  try {
    const { sessionId, targetId, category, weight = 1 } = req.body;
    const voterId = req.user.id;

    const validCategories = ['best_gas', 'fan_favorite', 'next_picker'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const session = await db('sessions').where({ id: sessionId }).first();
    if (!session || (session.status !== 'live' && new Date() - new Date(session.scheduled_end) > 10 * 60 * 1000)) {
      return res.status(400).json({ error: 'Voting closed' });
    }

    await db('votes')
      .insert({
        session_id: sessionId,
        voter_id: voterId,
        target_id: targetId,
        category,
        weight,
      })
      .onConflict(['session_id', 'voter_id', 'category', 'target_id'])
      .merge({ weight: db.raw('votes.weight + ?', [weight]) });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.getVoteTallies = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { category } = req.query;
    const query = db('votes')
      .select('target_id', db.raw('SUM(weight) as total'))
      .where({ session_id: sessionId })
      .groupBy('target_id');
    if (category) query.andWhere({ category });
    const tallies = await query;
    res.json(tallies);
  } catch (err) {
    next(err);
  }
};

exports.predictWinner = async (req, res, next) => {
  try {
    const { sessionId, predictedWinnerId } = req.body;
    const userId = req.user.id;

    const existing = await db('votes')
      .where({ session_id: sessionId, voter_id: userId, category: 'prediction' })
      .first();
    if (existing) return res.status(409).json({ error: 'Prediction already made' });

    // Deduct R5
    await db('users').where({ id: userId }).decrement('wallet_balance', 5);
    await db('transactions').insert({
      user_id: userId,
      amount: -5,
      type: 'prediction_fee',
      reference_id: sessionId,
    });

    await db('votes').insert({
      session_id: sessionId,
      voter_id: userId,
      target_id: predictedWinnerId,
      category: 'prediction',
      weight: 1,
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.resolveVoting = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    if (!['admin', 'presenter'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

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
        await addWallet(winner.target_id, 50, 'vote_prize', sessionId);
      }
    }

    // Prediction winners get badge (stats increment)
    const actualWinner = await db('session_contestants')
      .where({ session_id: sessionId, winner: true })
      .first();
    if (actualWinner) {
      await db('votes')
        .where({ session_id: sessionId, category: 'prediction', target_id: actualWinner.user_id })
        .update({ weight: db.raw('weight + 10') }); // bonus for correct predictors
    }

    res.json({ success: true, results });
  } catch (err) {
    next(err);
  }
};
