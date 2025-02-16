import { Global, Module } from '@nestjs/common';
import { UserRepository } from './repositories';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Global()
@Module({
  providers: [UserRepository, UserService, UserResolver],
  exports: [UserRepository],
})
export class UserModule {}
