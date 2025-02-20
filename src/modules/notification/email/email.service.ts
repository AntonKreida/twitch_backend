import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { emailTemplate } from './templates';
import { ISendEmail } from './lib';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail({
    title,
    subtitle,
    emailFrom,
    emailTo,
    subject,
    link,
    message,
    textLink,
    metadata,
  }: ISendEmail): Promise<boolean> {
    await this.mailerService.sendMail({
      from: emailFrom,
      to: emailTo,
      subject: subject,
      html: await emailTemplate({
        title,
        subtitle,
        link,
        message,
        textLink,
        metadata,
      }),
    });

    return true;
  }
}
