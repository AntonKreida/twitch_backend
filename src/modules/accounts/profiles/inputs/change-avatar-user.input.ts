import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import * as Upload from 'graphql-upload/GraphQLUpload.js';

@InputType()
export class ChangeAvatarUserInput {
  @Field(() => Upload, { nullable: false })
  @IsNotEmpty({ message: 'avatar не может быть пустым' })
  avatar: Upload;
}
