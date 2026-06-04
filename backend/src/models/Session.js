const db = require('../config/database');

const Session = {
  async create(data) {
    const [session] = await db('sessions').insert(data).returning('*');
    return session;
  },

  async findById(id) {
    return db('sessions').where({ id }).first();
  },

  async update(id, updates) {
    const [session] = await db('sessions').where({ id }).update(updates).returning('*');
    return session;
  },

  async getUpcoming() {
    return db('sessions')
      .where('scheduled_start', '>', new Date())
      .andWhere('status', 'scheduled')
      .orderBy('scheduled_start', 'asc');
  },

  async addContestant(sessionId, userId, extras = {}) {
    const data = { session_id: sessionId, user_id: userId, ...extras };
    await db('session_contestants').insert(data).onConflict(['session_id', 'user_id']).ignore();
  },

  async getContestants(sessionId) {
    return db('session_contestants')
      .join('users', 'session_contestants.user_id', 'users.id')
      .where({ session_id: sessionId })
      .select('users.*', 'session_contestants.eliminated', 'session_contestants.is_top3', 'session_contestants.winner');
  },

  async setTop3(sessionId, userIds) {
    // Reset all contestants to not top3, then set selected ones
    await db('session_contestants').where({ session_id: sessionId }).update({ is_top3: false });
    if (userIds.length) {
      await db('session_contestants')
        .where({ session_id: sessionId })
        .whereIn('user_id', userIds)
        .update({ is_top3: true });
    }
  },
};

module.exports = Session;
