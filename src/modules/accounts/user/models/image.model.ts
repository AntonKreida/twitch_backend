import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Image } from '/prisma/generated';
import { UserAvatarModel } from './user-avatar.model';

@ObjectType()
export class ImageModel implements Image {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  src: string;

  @Field(() => UserAvatarModel, { nullable: true })
  userAvatar?: UserAvatarModel;
}
