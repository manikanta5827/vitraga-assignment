const nodemailer = require('nodemailer');
require('dotenv').config();

if(!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email user or password are not configured in env file");
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to, subject, text) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
  console.log(`Email sent to ${to}`);
}

module.exports = sendEmail;
