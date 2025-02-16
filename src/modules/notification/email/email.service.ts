import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { emailTemplate } from './templates';
import { ISendEmail } from './lib';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail({
    firstName,
    lastName,
    emailFrom,
    emailTo,
    subject,
    link,
  }: ISendEmail): Promise<void> {
    await this.mailerService.sendMail({
      from: emailFrom,
      to: emailTo,
      subject: subject,
      html: await emailTemplate({
        firstName,
        lastName,
        link,
      }),
    });
  }
}
