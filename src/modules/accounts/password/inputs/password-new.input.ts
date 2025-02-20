import { InputType, Field } from '@nestjs/graphql';
import { IsString, MinLength, IsNotEmpty } from 'class-validator';
import { IsMatchPassword } from '@shared';

@InputType()
export class PasswordNewInput {
  @Field(() => String, { nullable: false })
  @IsString({ message: 'password должно быть строкой' })
  @IsNotEmpty({ message: 'password не может быть пустым' })
  @MinLength(8, { message: 'password должен быть больше 8-х символов' })
  password: string;

  @Field(() => String, { nullable: false })
  @IsString({ message: 'passwordRepeat должно быть строкой' })
  @IsNotEmpty({ message: 'passwordRepeat не может быть пустым' })
  @MinLength(8, { message: 'passwordRepeat должен быть больше 8-х символов' })
  @IsMatchPassword()
  passwordRepeat: string;

  @Field(() => String, { nullable: false })
  @IsString({ message: 'token должно быть строкой' })
  @IsNotEmpty({ message: 'token не может быть пустым' })
  token: string;
}
