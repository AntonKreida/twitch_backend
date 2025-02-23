import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@/modules/accounts/user/repositories';
import { UserModel } from '../user';

@Injectable()
export class ProfilesService {
  constructor(private readonly userRepository: UserRepository) {}

  async changeEmail(userId: string, email: string): Promise<UserModel> {
    const user = await this.userRepository.findUser({ id: userId });

    if (!user) {
      throw new NotFoundException('Пользователь не найден!');
    }

    return await this.userRepository.updateUser({
      id: user.id,
      email,
    });
  }
}
