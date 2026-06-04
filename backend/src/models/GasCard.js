const db = require('../config/database');

const GasCard = {
  async create(data) {
    const [gasCard] = await db('gas_cards').insert(data).returning('*');
    return gasCard;
  },

  async findBySession(sessionId) {
    return db('gas_cards')
      .where({ session_id: sessionId })
      .orderBy('created_at', 'asc');
  },

  async markDisqualified(id) {
    await db('gas_cards').where({ id }).update({ was_disqualified: true });
  },
};

module.exports = GasCard;
