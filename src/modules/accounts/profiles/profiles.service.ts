import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@/modules/accounts/user/repositories';
import { ConfigService } from '@nestjs/config';
import * as Upload from 'graphql-upload/GraphQLUpload.js';
import { UserModel } from '../user';
import { ChangeProfileInfoInput } from './inputs';

import { deleteFile, uploadFileStream } from '@shared';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

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

  async changeUserAvatar(userId: string, file: Upload): Promise<true> {
    const user = await this.userRepository.findUser({ id: userId });

    if (!user) {
      throw new NotFoundException('Пользователь не найден!');
    }

    const filePath = await uploadFileStream({
      readStream: file.createReadStream,
      uploadDir: this.configService.getOrThrow<string>('UPLOAD_DIR_NAME'),
      filename: `avatar-${user.username}.${file.mimetype.split('/')[1]}`,
      sharpSetting: {
        width: 512,
        height: 512,
        fit: 'cover',
        toFormat: file.mimetype.split('/')[1],
        quality: 50,
      },
    });

    if (user.avatar) {
      await deleteFile({
        pathFile: user.avatar,
      });

      await this.userRepository.updateUserAvatar(userId, filePath);

      return true;
    }

    await this.userRepository.updateUserAvatar(userId, filePath);

    return true;
  }

  async changeUserProfileInfo(
    userId: string,
    updateUser: ChangeProfileInfoInput,
  ): Promise<boolean> {
    const user = await this.userRepository.findUser({ id: userId });

    if (!user) {
      throw new NotFoundException('Пользователь не найден!');
    }

    const isUsernameExist = await this.userRepository.findUser({
      username: updateUser.username,
    });

    if (isUsernameExist) {
      throw new NotFoundException(
        'Пользователь с таким username уже существует!',
      );
    }

    await this.userRepository.updateUser({
      id: user.id,
      ...updateUser,
    });

    return true;
  }
}
