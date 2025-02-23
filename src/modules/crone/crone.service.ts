import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserRepository } from '@/modules/accounts/user/repositories';

@Injectable()
export class CroneService {
  constructor(private readonly userRepository: UserRepository) {}

  @Cron('*/10 * * * * *')
  async deleteIsDeactivatedAccount() {
    const users = await this.userRepository.findAll({
      isDeactivatedAccount: true,
    });

    console.log(users);
  }
}
