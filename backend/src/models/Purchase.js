const db = require('../config/database');

const Purchase = {
  async create(data) {
    const [purchase] = await db('purchases').insert(data).returning('*');
    return purchase;
  },

  async findById(id) {
    return db('purchases').where({ id }).first();
  },

  async markUsed(id) {
    return db('purchases').where({ id }).update({ used: true, used_at: new Date() });
  },

  async getUnusedByUser(userId, sessionId) {
    return db('purchases')
      .where({ user_id: userId, session_id: sessionId, used: false })
      .orderBy('created_at', 'asc');
  },
};

module.exports = Purchase;
