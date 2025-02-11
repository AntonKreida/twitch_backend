import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { SessionService } from './session.service';
import { Auth, IContext } from '@shared';
import { SessionModel } from './models';

@Resolver('Session')
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Auth()
  @Query(() => [SessionModel], { name: 'session' })
  async session(@Context() { req }: IContext): Promise<SessionModel[]> {
    return await this.sessionService.findSessionByUser(req);
  }

  @Auth()
  @Query(() => SessionModel, { name: 'currentSession' })
  async currentSession(@Context() { req }: IContext): Promise<SessionModel> {
    return await this.sessionService.findCurrentSession(req);
  }

  @Auth()
  @Query(() => Boolean, { name: 'clearSession' })
  async clearSession(@Context() { res }: IContext): Promise<boolean> {
    return await this.sessionService.clearCookie(res);
  }

  @Auth()
  @Query(() => Boolean, { name: 'removeSession' })
  async removeSession(
    @Context() { req }: IContext,
    @Args('id') id: string,
  ): Promise<boolean> {
    return await this.sessionService.removeSessionById(req, id);
  }
}
