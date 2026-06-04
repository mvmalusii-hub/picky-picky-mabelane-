const db = require('../config/database');

exports.submitAudition = async (req, res, next) => {
  try {
    const { full_name, email, phone, video1_url, video2_url } = req.body;
    const [submission] = await db('audition_submissions')
      .insert({ full_name, email, phone, video1_url, video2_url, status: 'pending' })
      .returning('*');
    res.status(201).json(submission);
  } catch (err) {
    next(err);
  }
};

exports.getAllAuditions = async (req, res, next) => {
  try {
    const submissions = await db('audition_submissions')
      .orderBy('submitted_at', 'desc');
    res.json(submissions);
  } catch (err) {
    next(err);
  }
};

exports.updateAuditionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;
    await db('audition_submissions')
      .where({ id })
      .update({ status, admin_notes });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
