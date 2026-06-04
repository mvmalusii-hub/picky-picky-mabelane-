const db = require('../config/database');

exports.getStats = async (req, res, next) => {
  try {
    const totalUsers = await db('users').count('id as count').first();
    const activeSubscriptions = await db('subscriptions').where({ status: 'active' }).count('id as count').first();
    const revenueToday = await db('transactions')
      .where('created_at', '>', new Date().setHours(0,0,0,0))
      .andWhere('amount', '>', 0)
      .sum('amount as total')
      .first();
    const finesTotal = await db('fines').sum('amount as total').first();
    const sessionsCompleted = await db('sessions').where({ status: 'ended' }).count('id as count').first();

    res.json({
      total_users: parseInt(totalUsers.count),
      active_subscriptions: parseInt(activeSubscriptions.count),
      revenue_today: parseInt(revenueToday.total || 0),
      fines_collected_total: parseInt(finesTotal.total || 0),
      sessions_completed: parseInt(sessionsCompleted.count),
    });
  } catch (err) {
    next(err);
  }
};

exports.createSession = async (req, res, next) => {
  try {
    const { scheduled_start, scheduled_end, picker_id, presenter_id } = req.body;
    const [session] = await db('sessions').insert({
      scheduled_start,
      scheduled_end,
      picker_id,
      presenter_id,
      status: 'scheduled',
    }).returning('*');
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
};

exports.getAllSessions = async (req, res, next) => {
  try {
    const sessions = await db('sessions').orderBy('scheduled_start', 'desc');
    res.json(sessions);
  } catch (err) {
    next(err);
  }
};

exports.cancelSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const session = await db('sessions').where({ id, status: 'scheduled' }).first();
    if (!session) return res.status(404).json({ error: 'Session not found or already started' });

    await db('sessions').where({ id }).update({ status: 'cancelled' });
    // Optionally refund participants – omitted for brevity
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
