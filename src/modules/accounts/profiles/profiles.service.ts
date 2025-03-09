import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '@/modules/accounts/user/repositories';
import { ConfigService } from '@nestjs/config';
import * as Upload from 'graphql-upload/GraphQLUpload.js';
import {
  AvatarRepository,
  SocialEntity,
  SocialModel,
  SocialRepository,
  UserModel,
} from '../user';
import {
  ChangeProfileInfoInput,
  ChangeReorderSocialInput,
  CreateSocialInput,
  ChangeUpdateSocialInput,
} from './inputs';

import { deleteFile, uploadFileStream } from '@shared';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly avatarRepository: AvatarRepository,
    private readonly configService: ConfigService,
    private readonly socialRepository: SocialRepository,
  ) {}

  async changeEmail(userId: string, email: string): Promise<UserModel> {
    const user = await this.userRepository.findUser({ id: userId });

    if (!user) {
      throw new NotFoundException('Пользователь не найден!');
    }

    const isEmailExist = await this.userRepository.findUser({ email });

    if (isEmailExist) {
      throw new ConflictException('Пользователь с таким email уже существует!');
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
      uploadDir: `${this.configService.getOrThrow<string>(
        'UPLOAD_DIR_NAME',
      )}/avatar`,
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

      await this.avatarRepository.deleteAvatar(user.id);
    }

    await this.avatarRepository.createAvatar(user.id, filePath);

    return true;
  }

  async removeUserAvatar(userId: string): Promise<boolean> {
    const user = await this.userRepository.findUser({ id: userId });

    if (!user) {
      throw new NotFoundException('Пользователь не найден!');
    }

    if (user.avatar) {
      await deleteFile({
        pathFile: user.avatar,
      });

      await this.avatarRepository.deleteAvatar(user.id);
    }

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
      throw new ConflictException(
        'Пользователь с таким username уже существует!',
      );
    }

    await this.userRepository.updateUser({
      id: user.id,
      ...updateUser,
    });

    return true;
  }

  async createSocial(
    userId: string,
    { title, url }: CreateSocialInput,
  ): Promise<boolean> {
    const lastSocial = await this.socialRepository.findSocial({
      where: {
        userId,
      },
      orderBy: {
        position: 'desc',
      },
    });

    const social = await new SocialEntity({
      title,
      url,
      userId,
    }).determinePosition(lastSocial?.position || 0);

    await this.socialRepository.createSocial(social);

    return true;
  }

  async reorderSocial(
    socialList: ChangeReorderSocialInput[],
  ): Promise<boolean> {
    if (!socialList?.length) {
      return true;
    }

    const promisesSocial = socialList.map(({ id, position }) => {
      return this.socialRepository.updateSocial({
        where: {
          id,
        },
        data: {
          position,
        },
      });
    });

    const result = await Promise.all(promisesSocial)
      .then(() => true)
      .catch(() => false);

    return result;
  }

  async deleteSocial(socialId: string): Promise<boolean> {
    await this.socialRepository.deleteSocial(socialId);

    return true;
  }

  async updateSocial({
    id,
    title,
    url,
  }: ChangeUpdateSocialInput): Promise<boolean> {
    await this.socialRepository.updateSocial({
      where: {
        id,
      },
      data: {
        title,
        url,
      },
    });

    return true;
  }

  async findSocials(userId: string): Promise<SocialModel[]> {
    return await this.socialRepository.findAllSocials({
      where: {
        userId,
      },
      orderBy: {
        position: 'asc',
      },
    });
  }
}
