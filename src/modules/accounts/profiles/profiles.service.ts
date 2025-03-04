import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@/modules/accounts/user/repositories';
import * as Upload from 'graphql-upload/GraphQLUpload.js';
import { UserModel } from '../user';
import { deleteFile, uploadFileStream } from '@shared';
import { ConfigService } from '@nestjs/config';

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
}
