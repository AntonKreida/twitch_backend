import { Field, InputType } from '@nestjs/graphql';
import * as Upload from 'graphql-upload/GraphQLUpload.js';
import { IsMatchFile } from '@shared';

@InputType()
export class ChangePreviewStreamInput {
  @Field(() => Upload, { nullable: true })
  @IsMatchFile(
    {
      listExtensions: ['jpg', 'jpeg', 'png', 'gif'],
      maxSize: 10 * 1024 * 1024,
    },
    {
      message: 'Некорректный файл',
    },
  )
  streamPreview: Upload;
}
