const nodemailer = require('nodemailer');
const pug = require('pug');
const html2Text = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name.split(' ')[0];
    this.url = url;
    this.from = `HIDRO-db <${process.env.EMAIL_FROM}>`;
  }

  newTransporter() {
    if (process.env.NODE_ENV === 'production') {
      console.log('production');
    }

    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASS,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      name: this.name,
      url: this.url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: html2Text.htmlToText(html),
      html: html,
    };

    await this.newTransporter().sendMail(mailOptions);
  }

  async sendResetPassword() {
    await this.send('resetEmail', 'Mudança de senha - HIDRO-db');
  }

  async sendNewUser() {
    await this.send(
      'newUser',
      'Bem-vindo ao HIDRO-db - Complete seu cadastro'
    );
  }
};
