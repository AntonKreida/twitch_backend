import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class PasswordConfirmInput {
  @Field(() => String)
  @IsString({ message: 'password должно быть строкой' })
  @IsNotEmpty({ message: 'password не может быть пустым' })
  @MinLength(8, { message: 'password должен быть больше 8-х символов' })
  password: string;
}
