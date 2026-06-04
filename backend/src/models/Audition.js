const db = require('../config/database');

const Audition = {
  async create(data) {
    const [submission] = await db('audition_submissions').insert(data).returning('*');
    return submission;
  },

  async findAll(status = null) {
    const query = db('audition_submissions').orderBy('submitted_at', 'desc');
    if (status) query.where({ status });
    return query;
  },

  async updateStatus(id, status, adminNotes = null) {
    const update = { status };
    if (adminNotes !== null) update.admin_notes = adminNotes;
    const [submission] = await db('audition_submissions').where({ id }).update(update).returning('*');
    return submission;
  },
};

module.exports = Audition;
