import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { emailTemplate } from './templates';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(text: string): Promise<void> {
    await this.mailerService.sendMail({
      from: 'you@example.com',
      to: 'user@gmail.com',
      subject: 'hello world',
      html: await emailTemplate({
        text: text,
      }),
    });
  }
}
