import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserRepository, UserEntity, IArgsFindUser, UserModel } from '../user';
import { type InputUserSignUpDto } from './dto';
import { type SortOrPaginationArgsType } from '@shared';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser({
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

  async validateUser(username: string, password: string): Promise<UserModel> {
    const user = await this.userRepository.findUser({ username });

    if (!user) {
      throw new NotFoundException('Пользователь не найден!');
    }

    const newUserEntity = new UserEntity(user);
    const isCorrectPassword = await newUserEntity.validatePassword(password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException('Неверный пароль!');
    }

    return user;
  }
}
