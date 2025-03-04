import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserRepository } from '@/modules/accounts/user/repositories';
import { EmailService } from '@/modules/notification';
import { ConfigService } from '@nestjs/config';
import { deleteFile } from '/src/shared';

@Injectable()
export class CroneService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  @Cron('0 0 0 * * *')
  async deleteIsDeactivatedAccount() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const users = await this.userRepository.findAll({
      isDeactivatedAccount: true,
      deactivatedAt: sevenDaysAgo,
    });

    const hostnameClient = await this.configService.getOrThrow<string>(
      'ALLOWED_ORIGIN',
    );

    const urlForLink = new URL(hostnameClient);
    urlForLink.pathname = '/signIn';

    for (const user of users) {
      await this.emailService.sendEmail({
        emailFrom: 'Kx5wO@example.com',
        emailTo: user.email,
        subject: 'Удаление аккаунта на TvStream',
        title: 'Удаление аккаунта на TvStream',
        message:
          'Ваш аккаунт был удален из-за неактивности. Спасибо что были с нам! Если вы хотите восстановить свой аккаунт, пожалуйста зарегистрируйтесь заново по нажатию на кнопку ниже.',
        subtitle: `Привет ${user.firstName} ${user.lastName}, `,
        link: urlForLink.href,
        textLink: 'Восстановить аккаунт',
      });

      await deleteFile({
        pathFile: user.avatar,
      });
    }

    await this.userRepository.deletedUsers({
      isDeactivatedAccount: true,
      deactivatedAt: {
        lte: sevenDaysAgo,
      },
    });
  }
}
