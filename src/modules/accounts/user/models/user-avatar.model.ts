import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserAvatar } from '/prisma/generated';
import { UserModel } from './user.model';
import { ImageModel } from './image.model';

@ObjectType()
export class UserAvatarModel implements UserAvatar {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => UserModel)
  user: UserModel;

  @Field(() => ID)
  imageId: string;

  @Field(() => ImageModel)
  image: ImageModel;
}
