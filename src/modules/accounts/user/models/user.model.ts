import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '/prisma/generated';
import { UserAvatarModel } from './user-avatar.model';

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

  @Field(() => UserAvatarModel, { nullable: true })
  userAvatar?: UserAvatarModel;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  bio: string | null;

  @Field(() => Boolean)
  isEmailVerification: boolean;

  @Field(() => Boolean)
  isTwoFactorEnable: boolean;

  @Field(() => String, { nullable: true })
  twoFactorSecret: string | null;

  @Field(() => String)
  passwordHash: string;

  @Field(() => Boolean)
  isDeactivatedAccount: boolean;

  @Field(() => Date, { nullable: true })
  deactivatedAt: Date | null;

  @Field(() => Date)
  createAt: Date;

  @Field(() => Date)
  updateAt: Date;
}
