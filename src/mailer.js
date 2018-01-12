import nodemailer from 'nodemailer';

const from = '"Alex100dre" <alex100dre.pro@gmail.com>'

function setup() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

export function sendConfirmationEmail(user) {
  const transport = setup();

  const email = {
    from,
    to: user.email,
    subject: 'Portfolio confirmation mail',
    text: `
      Click the link below to confirm your email.

      ${user.generateConfirmationUrl()}
    `
  }

  transport.sendMail(email);
}

export function sendResetPasswordEmail(user) {
  const transport = setup();

  const email = {
    from,
    to: user.email,
    subject: 'Portfolio confirmation mail',
    text: `
      Click the link below to reset your password.

      ${user.generateResetPasswordUrl()}
    `
  }

  transport.sendMail(email);
}
