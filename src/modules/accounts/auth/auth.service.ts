import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository, UserEntity, IArgsFindUser } from '../user';
import { User } from '/prisma/generated';
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
  }: InputUserSignUpDto): Promise<User> {
    const isUsernameExist = await this.userRepository.findUser({
      username,
    });

    if (isUsernameExist) {
      throw new ConflictException(
        'Пользователь с таким username уже существует',
      );
    }

    const IsEmailExist = await this.userRepository.findUser({
      email,
    });

    if (IsEmailExist) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const newEntityUser = await new UserEntity({
      avatar,
      bio,
      email,
      firstName,
      lastName,
      username,
    }).setPassword(password);

    return await this.userRepository.createUser(newEntityUser);
  }

  async findUsers({
    sort,
    pagination,
  }: SortOrPaginationArgsType): Promise<User[]> {
    return await this.userRepository.findAll({
      sort,
      pagination,
    });
  }

  async findUser(args: Partial<IArgsFindUser>): Promise<User | null> {
    return await this.userRepository.findUser(args);
  }
}
