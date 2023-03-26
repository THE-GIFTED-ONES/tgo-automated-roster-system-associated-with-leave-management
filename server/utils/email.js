const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const fs = require('fs');
const path = require('path');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.empName.split(' ')[0];
    this.url = url;
    this.from = `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV.trim() === 'production') {
      // Sendgrid
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // 1.) HTML Template
    const html = fs.readFileSync(
      path.join(__dirname, '..', 'views', 'emails', `${template}.html`),
      'utf-8'
    );

    //const htmltext = htmlToText.fromString(html);

    // 2.) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: html
        .replace('{{Employee Name}}', this.firstName)
        .replace(/{{Reset_URL}}/g, this.url)
        .replace('{{SUBJECT}}', subject),
      //text: htmltext,
    };

    // 3.) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to OrangeHRM Family !');
  }

  async sendPasswordReset() {
    await this.send(
      'resetPassword',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};
