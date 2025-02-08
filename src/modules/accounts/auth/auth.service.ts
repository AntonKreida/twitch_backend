import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { type Response, type Request } from 'express';

import { UserRepository, UserEntity, IArgsFindUser, UserModel } from '../user';
import { type InputUserSignUpDto } from './dto';
import { ISessionMetadata, type SortOrPaginationArgsType } from '@shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async signUp({
    avatar,
    bio,
    email,
    firstName,
    lastName,
    password,
    username,
  }: InputUserSignUpDto): Promise<UserModel> {
    const isUsernameExist = await this.userRepository.findUser({
      username,
    });

    if (isUsernameExist) {
      throw new ConflictException(
        'Пользователь с таким username уже существует!',
      );
    }

    const IsEmailExist = await this.userRepository.findUser({
      email,
    });

    if (IsEmailExist) {
      throw new ConflictException('Пользователь с таким email уже существует!');
    }

    const newEntityUser = await new UserEntity({
      avatar,
      bio,
      email,
      firstName,
      lastName,
      username,
      passwordHash: '',
    }).setPassword(password);

    return await this.userRepository.createUser(newEntityUser);
  }

  async findUsers({
    sort,
    pagination,
  }: SortOrPaginationArgsType): Promise<UserModel[]> {
    return await this.userRepository.findAll({
      sort,
      pagination,
    });
  }

  async findUser(args: Partial<IArgsFindUser>): Promise<UserModel | null> {
    return await this.userRepository.findUser(args);
  }

  async signIn(
    req: Request,
    username: string,
    password: string,
    metadata: ISessionMetadata,
  ): Promise<UserModel> {
    const user = await this.userRepository.findUser({ username });

    if (!user) {
      throw new NotFoundException('Пользователь не найден!');
    }

    const newUserEntity = new UserEntity(user);
    const isCorrectPassword = await newUserEntity.validatePassword(password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException('Неверный пароль!');
    }

    return new Promise((resolve, reject) => {
      req.session.userId = user.id;
      req.session.createAt = new Date();
      req.session.metadata = metadata;

      req.session.save((error) => {
        if (error) {
          reject(
            new InternalServerErrorException(
              'При сохранении сессии произошла ошибка!',
            ),
          );
        }

        resolve(user);
      });
    });
  }

  async signOut(req: Request, res: Response): Promise<string> {
    return new Promise((resolve, reject) => {
      req.session.destroy((error) => {
        if (error) {
          reject(
            new InternalServerErrorException(
              'При удалении сессии произошла ошибка!',
            ),
          );
        }

        res.clearCookie(`${this.configService.getOrThrow('SESSION_NAME')}`);

        resolve('Вы успешно вышли из системы!');
      });
    });
  }
}
