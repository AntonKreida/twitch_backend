import { Module } from '@nestjs/common';
import { UserRepository } from './repositories';
import { UserResolver } from './user.resolver';

@Module({
  providers: [UserRepository, UserResolver],
})
export class UserModule {}
