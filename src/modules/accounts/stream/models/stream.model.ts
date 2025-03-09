import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Stream } from '/prisma/generated';

import { UserModel } from '@/modules/accounts/user/models';
import { pathFileMiddleware } from '@shared';

@ObjectType()
export class StreamModel implements Stream {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true, middleware: [pathFileMiddleware] })
  streamPreview: string | null;

  @Field(() => String, { nullable: true })
  ingressId: string | null;

  @Field(() => String, { nullable: true })
  serverUrl: string | null;

  @Field(() => String, { nullable: true })
  streamKey: string | null;

  @Field(() => Boolean)
  isLive: boolean;

  @Field(() => Date)
  createAt: Date;

  @Field(() => Date)
  updateAt: Date;

  @Field(() => ID)
  userId: string;

  @Field(() => UserModel)
  user?: UserModel;
}
