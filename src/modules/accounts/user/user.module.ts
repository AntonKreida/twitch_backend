import { Global, Module } from '@nestjs/common';
import {
  AvatarRepository,
  SocialRepository,
  UserRepository,
} from './repositories';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Global()
@Module({
  providers: [
    UserRepository,
    AvatarRepository,
    SocialRepository,
    UserService,
    UserResolver,
  ],
  exports: [UserRepository, SocialRepository, AvatarRepository],
})
export class UserModule {}
