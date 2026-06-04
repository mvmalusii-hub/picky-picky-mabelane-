const db = require('../config/database');

const Fine = {
  async create(data) {
    const [fine] = await db('fines').insert(data).returning('*');
    return fine;
  },

  async markPaid(id) {
    await db('fines').where({ id }).update({ paid: true });
  },

  async getUserFines(userId) {
    return db('fines').where({ user_id: userId }).orderBy('created_at', 'desc');
  },
};

module.exports = Fine;
