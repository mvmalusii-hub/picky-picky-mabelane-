const db = require('../config/database');

const Subscription = {
  async create(data) {
    const [sub] = await db('subscriptions').insert(data).returning('*');
    return sub;
  },

  async findByUser(userId) {
    return db('subscriptions')
      .where({ user_id: userId, status: 'active' })
      .orderBy('created_at', 'desc')
      .first();
  },

  async cancel(subscriptionId) {
    await db('subscriptions').where({ id: subscriptionId }).update({ status: 'cancelled' });
  },
};

module.exports = Subscription;
