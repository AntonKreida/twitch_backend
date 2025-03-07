import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import * as Upload from 'graphql-upload/GraphQLUpload.js';

import { IsMatchFile } from '@shared';

@InputType()
export class ChangeAvatarUserInput {
  @Field(() => Upload, { nullable: false })
  @IsNotEmpty({ message: 'avatar не может быть пустым' })
  @IsMatchFile(
    {
      listExtensions: ['jpg', 'jpeg', 'png'],
      maxSize: 2 * 1024 * 1024,
    },
    {
      message: 'Некорректный файл',
    },
  )
  avatar: Upload;
}
