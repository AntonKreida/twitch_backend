import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class ChangeEmailUserInput {
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
}
