import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InternalServerErrorException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserModel } from '../user';
import { ArgsUserDto, InputUserSignInDto, InputUserSignUpDto } from './dto';
import { SortOrPaginationArgsType, IContext } from '@shared';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

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
  async signIn(
    @Args('inputUserSignIn') inputUser: InputUserSignInDto,
    @Context() ctx: IContext,
  ): Promise<UserModel> {
    const { username, password } = inputUser;

    const user = await this.authService.validateUser(username, password);

    return new Promise((resolve, reject) => {
      ctx.req.session.userId = user.id;
      ctx.req.session.createAt = new Date();

      ctx.req.session.save((error) => {
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

  @Query(() => String, { name: 'SignOut' })
  async signOut(@Context() ctx: IContext): Promise<string> {
    return new Promise((resolve, reject) => {
      ctx.req.session.destroy((error) => {
        if (error) {
          reject(
            new InternalServerErrorException(
              'При удалении сессии произошла ошибка!',
            ),
          );
        }

        resolve('Вы успешно вышли из системы!');
      });
    });
  }
}
