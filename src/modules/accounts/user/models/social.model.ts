import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class SocialModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  url: string;

  @Field(() => Number)
  position: number;

  @Field(() => ID)
  userId: string;

  @Field(() => Date)
  createAt: Date;

  @Field(() => Date)
  updateAt: Date;
}
