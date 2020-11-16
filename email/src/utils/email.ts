import nodemailer from 'nodemailer';
import pug from 'pug';
import htmlToText from 'html-to-text';

interface User {
  name: string;
  email: string;
}

export class Email {
  private to: string;
  private firstName: string;
  private url: string;
  private from: string;

  constructor(user: User, url: string) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Giuliano Gabella <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    // if (process.env.NODE_ENV === 'production') {
    //   // Sendgrid - NEED TO SET UP BEFORE DEPLOYING TO PRODUCTION
    //   return nodemailer.createTransport({
    //     service: 'SendGrid',
    //     auth: {
    //       user: `${process.env.SENDGRID_USERNAME}`,
    //       pass: `${process.env.SENDGRID_PASSWORD}`,
    //     },
    //   });
    // }

    return nodemailer.createTransport({
      //@ts-ignore
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template: string, subject: string) {
    // 1) Render the HTML based on a pug template
    const html = pug.renderFile(
      `@ggabella-photo-share/common/build/views/email/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    // 2) Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to PhotoShare!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes'
    );
  }
}
