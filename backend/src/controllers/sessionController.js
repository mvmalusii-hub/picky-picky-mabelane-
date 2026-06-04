const db = require('../config/database');
const { deductWallet } = require('../services/walletService');
const { getLiveKitToken } = require('../config/livekit');

exports.getUpcomingSessions = async (req, res, next) => {
  try {
    const sessions = await db('sessions')
      .where('scheduled_start', '>', new Date())
      .andWhere('status', 'scheduled')
      .orderBy('scheduled_start', 'asc');
    res.json(sessions);
  } catch (err) {
    next(err);
  }
};

exports.joinSession = async (req, res, next) => {
  try {
    const { sessionId, role } = req.body;
    const userId = req.user.id;

    const session = await db('sessions').where({ id: sessionId, status: 'scheduled' }).first();
    if (!session) return res.status(404).json({ error: 'Session not found or already started' });

    let fee = 0;
    if (role === 'picker') fee = 50;
    else if (role === 'picked') fee = 20;
    else return res.status(400).json({ error: 'Invalid role' });

    const newBalance = await deductWallet(userId, fee, 'session_fee', sessionId);
    if (newBalance === null) return res.status(402).json({ error: 'Insufficient funds' });

    // Add to session_contestants (if not already)
    await db('session_contestants').insert({
      session_id: sessionId,
      user_id: userId,
      eliminated: false,
    }).onConflict(['session_id', 'user_id']).ignore();

    // Generate LiveKit token
    const roomName = `session_${sessionId}`;
    const livekitToken = await getLiveKitToken(roomName, userId, req.user.full_name, role);

    res.json({ success: true, new_balance: newBalance, livekit_token: livekitToken, room_name: roomName });
  } catch (err) {
    next(err);
  }
};

exports.getLiveKitToken = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // Verify user is in this session
    const contestant = await db('session_contestants')
      .where({ session_id: sessionId, user_id: userId })
      .first();
    if (!contestant && req.user.role !== 'presenter') {
      return res.status(403).json({ error: 'Not a participant of this session' });
    }

    const role = contestant ? (await db('sessions').where({ id: sessionId }).first()).picker_id === userId ? 'picker' : 'contestant' : 'viewer';
    const roomName = `session_${sessionId}`;
    const token = await getLiveKitToken(roomName, userId, req.user.full_name, role);
    res.json({ token, roomName, wsUrl: process.env.LIVEKIT_WS_URL });
  } catch (err) {
    next(err);
  }
};

exports.disqualify = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { contestant_id, reason } = req.body;

    const session = await db('sessions').where({ id: sessionId, status: 'live' }).first();
    if (!session) return res.status(400).json({ error: 'Session not live' });

    if (req.user.role !== 'admin' && session.presenter_id !== req.user.id) {
      return res.status(403).json({ error: 'Only presenter can disqualify' });
    }

    const fineAmount = 100;
    await db('fines').insert({ user_id: contestant_id, amount: fineAmount, reason });
    await db('users').where({ id: contestant_id }).decrement('wallet_balance', fineAmount);
    const banExpiry = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    await db('users').where({ id: contestant_id }).update({ ban_expires: banExpiry });

    res.json({ fine_charged: fineAmount, ban_expires: banExpiry });
  } catch (err) {
    next(err);
  }
};

exports.pickWinner = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { winner_id } = req.body;

    const session = await db('sessions').where({ id: sessionId, status: 'live' }).first();
    if (!session) return res.status(400).json({ error: 'Session not live' });
    if (req.user.role !== 'admin' && session.presenter_id !== req.user.id) {
      return res.status(403).json({ error: 'Only presenter can pick winner' });
    }

    await db('session_contestants')
      .where({ session_id: sessionId, user_id: winner_id })
      .update({ winner: true });
    await db('sessions').where({ id: sessionId }).update({ winner_id, status: 'ended' });

    // Award winner R50 credit
    await db('users').where({ id: winner_id }).increment('wallet_balance', 50);
    await db('transactions').insert({
      user_id: winner_id,
      amount: 50,
      type: 'winner_prize',
      reference_id: sessionId,
    });

    res.json({ success: true, winner_id });
  } catch (err) {
    next(err);
  }
};
