const db = require('../config/database');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await db('users')
      .select('id', 'email', 'full_name', 'phone', 'role', 'wallet_balance', 'stats_times_picked', 'stats_dates_won', 'stats_gas_thrown', 'stats_fines_paid', 'ban_expires')
      .where({ id: req.user.id })
      .first();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { full_name, phone } = req.body;
    const updated = await db('users')
      .where({ id: req.user.id })
      .update({ full_name, phone })
      .returning(['id', 'email', 'full_name', 'phone', 'role', 'wallet_balance']);
    res.json(updated[0]);
  } catch (err) {
    next(err);
  }
};

exports.getWallet = async (req, res, next) => {
  try {
    const user = await db('users').select('wallet_balance').where({ id: req.user.id }).first();
    const transactions = await db('transactions')
      .where({ user_id: req.user.id })
      .orderBy('created_at', 'desc')
      .limit(20);
    res.json({ balance: user.wallet_balance, transactions });
  } catch (err) {
    next(err);
  }
};
