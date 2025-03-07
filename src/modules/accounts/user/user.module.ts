import { Global, Module } from '@nestjs/common';
import { AvatarRepository, UserRepository } from './repositories';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Global()
@Module({
  providers: [UserRepository, AvatarRepository, UserService, UserResolver],
  exports: [UserRepository, AvatarRepository],
})
export class UserModule {}
