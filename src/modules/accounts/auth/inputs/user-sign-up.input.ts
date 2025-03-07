import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import * as Upload from 'graphql-upload/GraphQLUpload.js';

import { IsMatchFile } from '@shared';

@InputType()
export class UserSignUpInput {
  @Field(() => String)
  @IsString({
    message: 'firstName должно быть строкой',
  })
  @IsNotEmpty({ message: 'firstName не может быть пустым' })
  @MinLength(3, { message: 'firstName должно быть больше 3-х символов' })
  firstName: string;

  @Field(() => String)
  @IsString({
    message: 'lastName должна быть строкой',
  })
  @IsNotEmpty({ message: 'lastName не может быть пустым' })
  @MinLength(3, { message: 'lastName должна быть больше 3-х символов' })
  lastName: string;

  @Field(() => String)
  @IsString({
    message: 'email должен быть строкой',
  })
  @IsEmail(
    {},
    {
      message: 'Некорректный email',
    },
  )
  @IsNotEmpty({ message: 'email не может быть пустым' })
  @MinLength(3, { message: 'email должен быть больше 3-х символов' })
  email: string;

  @Field(() => String)
  @IsString({
    message: 'login должен быть строкой',
  })
  @IsNotEmpty({ message: 'username не может быть пустым' })
  @MinLength(3, { message: 'username должен быть больше 3-х символов' })
  @Matches(/^[a-zA-Z0-9_\s@!#$%^&*()\-+=]{3,}$/, {
    message:
      'username должен состоять только из латинских букв, цифр, пробелы, символов @!#$%^&*()-+=',
  })
  username: string;

  @Field(() => Upload, { nullable: true })
  @IsOptional()
  @IsMatchFile(
    {
      listExtensions: ['jpg', 'jpeg', 'png', 'gif'],
      maxSize: 5 * 1024 * 1024,
    },
    {
      message: 'Некорректный файл',
    },
  )
  avatar: Upload | null;

  @Field(() => String)
  @IsString({
    message: 'password должен быть строкой',
  })
  @MinLength(8, { message: 'password должен быть больше 8-х символов' })
  @IsNotEmpty({ message: 'password не может быть пустым' })
  password: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({
    message: 'bio должна быть строкой',
  })
  @IsNotEmpty({ message: 'bio не может быть пустым' })
  bio: string | null;
}
