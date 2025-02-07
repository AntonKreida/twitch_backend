import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { UserModel } from '../user';
import { ArgsUserDto, InputUserSignInDto, InputUserSignUpDto } from './dto';
import { SortOrPaginationArgsType, IContext, AuthGuard } from '@shared';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Query(() => [UserModel], { name: 'users' })
  async findAll(
    @Args() sortOrPaginationType: SortOrPaginationArgsType,
  ): Promise<UserModel[]> {
    return await this.authService.findUsers(sortOrPaginationType);
  }

  @Query(() => UserModel, { name: 'user', nullable: true })
  async find(@Args() args: ArgsUserDto): Promise<UserModel | null> {
    return await this.authService.findUser(args);
  }

  @Mutation(() => UserModel, { name: 'signUp' })
  async signUp(
    @Args('inputUserSignUp') inputUser: InputUserSignUpDto,
  ): Promise<UserModel> {
    return this.authService.registerUser(inputUser);
  }

  @Mutation(() => UserModel, { name: 'signIn' })
  @UseGuards(AuthGuard)
  async signIn(
    @Args('inputUserSignIn') inputUser: InputUserSignInDto,
    @Context() { req }: IContext,
  ): Promise<UserModel> {
    const { username, password } = inputUser;

    const user = await this.authService.validateUser(username, password);

    return new Promise((resolve, reject) => {
      req.session.userId = user.id;
      req.session.createAt = new Date();

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

  @Mutation(() => String, { name: 'signOut' })
  async signOut(@Context() { req, res }: IContext): Promise<string> {
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
