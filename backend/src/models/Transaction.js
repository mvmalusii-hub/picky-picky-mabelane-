const db = require('../config/database');

const Transaction = {
  async create(data) {
    const [transaction] = await db('transactions').insert(data).returning('*');
    return transaction;
  },

  async getUserTransactions(userId, limit = 20) {
    return db('transactions')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .limit(limit);
  },
};

module.exports = Transaction;
