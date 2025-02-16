import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '/prisma/generated';

@ObjectType()
export class UserModel implements User {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  avatar: string | null;

  @Field(() => String, { nullable: true })
  bio: string | null;

  @Field(() => Boolean)
  isEmailVerification: boolean;

  @Field(() => String)
  passwordHash: string;

  @Field(() => Date)
  createAt: Date;

  @Field(() => Date)
  updateAt: Date;
}
