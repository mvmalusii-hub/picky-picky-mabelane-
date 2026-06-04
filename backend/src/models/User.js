const db = require('../config/database');

const User = {
  async create(data) {
    const [user] = await db('users').insert(data).returning('*');
    delete user.password_hash;
    return user;
  },

  async findByEmail(email) {
    return db('users').where({ email }).first();
  },

  async findById(id) {
    const user = await db('users').where({ id }).first();
    if (user) delete user.password_hash;
    return user;
  },

  async update(id, updates) {
    const [user] = await db('users').where({ id }).update(updates).returning('*');
    if (user) delete user.password_hash;
    return user;
  },

  async incrementWallet(id, amount) {
    await db('users').where({ id }).increment('wallet_balance', amount);
    return this.findById(id);
  },

  async addStat(id, statField, increment = 1) {
    await db('users').where({ id }).increment(statField, increment);
  },
};

module.exports = User;
