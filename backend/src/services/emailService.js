const nodemailer = require('nodemailer');

// Configure transporter (using SMTP from env)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send a generic email.
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 */
async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from: `"Picky Picky Mabelane" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}

/**
 * Send welcome email after registration.
 * @param {string} email
 * @param {string} name
 */
async function sendWelcomeEmail(email, name) {
  const html = `
    <h1>Welcome to Picky Picky Mabelane, ${name}!</h1>
    <p>You've successfully registered. Start playing by joining a session or buying power-ups.</p>
    <a href="${process.env.FRONTEND_URL}/dashboard">Go to Dashboard</a>
  `;
  await sendEmail(email, 'Welcome to Picky Picky Mabelane', html);
}

/**
 * Notify a user about their audition status.
 * @param {string} email
 * @param {string} name
 * @param {string} status - approved / rejected
 * @param {string} notes - optional admin notes
 */
async function sendAuditionStatusEmail(email, name, status, notes = '') {
  const subject = status === 'approved' ? 'Your Presenter Audition Approved!' : 'Audition Update';
  const html = `
    <h2>Hi ${name},</h2>
    <p>Your audition has been <strong>${status}</strong>.</p>
    ${notes ? `<p>Notes: ${notes}</p>` : ''}
    <p>Log in to see next steps.</p>
  `;
  await sendEmail(email, subject, html);
}

/**
 * Send fine notification.
 * @param {string} email
 * @param {string} name
 * @param {number} amount
 * @param {string} reason
 */
async function sendFineEmail(email, name, amount, reason) {
  const html = `
    <h2>You have been fined R${amount}</h2>
    <p>Reason: ${reason}</p>
    <p>Your wallet has been deducted. A 3-day viewing ban is now active.</p>
  `;
  await sendEmail(email, 'Fine Charged on Picky Picky Mabelane', html);
}

module.exports = {
  sendWelcomeEmail,
  sendAuditionStatusEmail,
  sendFineEmail,
  sendEmail,
};
