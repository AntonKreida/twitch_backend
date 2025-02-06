import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '/prisma/generated';

@ObjectType()
export class UserModel implements User {
  @Field(() => ID)
  id: string;

  firstName: string;

  lastName: string;

  username: string;

  email: string;

  @Field(() => String, { nullable: true })
  avatar: string | null;

  @Field(() => String, { nullable: true })
  bio: string | null;

  passwordHash: string;

  createAt: Date;

  updateAt: Date;
}
