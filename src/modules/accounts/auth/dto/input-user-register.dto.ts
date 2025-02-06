import { InputType, Field } from '@nestjs/graphql';
import { User } from '/prisma/generated';
import {
  IsEmail,
  IsOptional,
  MinLength,
  IsString,
  IsNotEmpty,
  Matches,
} from 'class-validator';

@InputType()
export class InputUserSignUpDto
  implements Omit<User, 'id' | 'createAt' | 'updateAt' | 'passwordHash'>
{
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
    message: 'avatar должен быть строкой',
  })
  @IsNotEmpty({ message: 'avatar не может быть пустым' })
  avatar: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({
    message: 'bio должна быть строкой',
  })
  @IsNotEmpty({ message: 'bio не может быть пустым' })
  bio: string | null;
}
