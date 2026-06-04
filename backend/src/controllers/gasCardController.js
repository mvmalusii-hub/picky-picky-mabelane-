const db = require('../config/database');

exports.submitGasCard = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { target_id, percentage } = req.body;
    const thrower_id = req.user.id;

    const session = await db('sessions').where({ id: sessionId, status: 'live' }).first();
    if (!session) return res.status(400).json({ error: 'Session not live' });

    // Optional: check if target has shield
    const shield = await db('session_contestants')
      .where({ session_id: sessionId, user_id: target_id, has_shield: true })
      .first();
    if (shield) return res.status(400).json({ error: 'Target is shielded' });

    await db('gas_cards').insert({
      session_id: sessionId,
      thrower_id,
      target_id,
      percentage,
    });

    res.json({ success: true, message: 'Gas card logged' });
  } catch (err) {
    next(err);
  }
};
