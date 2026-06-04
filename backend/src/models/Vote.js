const db = require('../config/database');

const Vote = {
  async create(voteData) {
    const [vote] = await db('votes').insert(voteData).returning('*');
    return vote;
  },

  async upsert(voteData) {
    const { session_id, voter_id, target_id, category, weight } = voteData;
    return db('votes')
      .insert({ session_id, voter_id, target_id, category, weight })
      .onConflict(['session_id', 'voter_id', 'category', 'target_id'])
      .merge({ weight: db.raw('votes.weight + ?', [weight]) });
  },

  async getTallies(sessionId, category = null) {
    const query = db('votes')
      .select('target_id', db.raw('SUM(weight) as total'))
      .where({ session_id: sessionId })
      .groupBy('target_id');
    if (category) query.andWhere({ category });
    return query;
  },

  async getPredictions(sessionId) {
    return db('votes')
      .where({ session_id: sessionId, category: 'prediction' })
      .select('voter_id', 'target_id');
  },
};

module.exports = Vote;
