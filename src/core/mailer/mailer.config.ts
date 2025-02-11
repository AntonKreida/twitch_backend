import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isDev } from '@shared';

@Injectable()
export class MailerConfigService implements MailerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMailerOptions(): Promise<MailerOptions> | MailerOptions {
    return {
      transport: {
        host: !isDev(this.configService)
          ? this.configService.getOrThrow<string>('SMTP_HOST')
          : 'localhost',
        port: !isDev(this.configService)
          ? this.configService.getOrThrow<number>('SMTP_PORT')
          : 1025,
        secure: !isDev(this.configService),
        auth: {
          user: this.configService.getOrThrow<string>('SMTP_USER'),
          pass: this.configService.getOrThrow<string>('SMTP_PASSWORD'),
        },
      },
      defaults: {
        from: this.configService.getOrThrow<string>('SMTP_FROM'),
      },
    };
  }
}
