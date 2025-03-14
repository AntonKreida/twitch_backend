import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '/prisma/generated';
import { SocialModel } from './social.model';

import { pathFileMiddleware } from '@shared';

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

  @Field(() => String, {
    nullable: true,
    middleware: [pathFileMiddleware],
  })
  avatar: string | null;

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

  @Field(() => [SocialModel])
  social: SocialModel[];
}
