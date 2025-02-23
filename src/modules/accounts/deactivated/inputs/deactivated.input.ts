import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class DeactivatedInput {
  @Field(() => String)
  @IsString({ message: 'password должно быть строкой' })
  @IsNotEmpty({ message: 'password не может быть пустым' })
  @MinLength(8, { message: 'password должен быть больше 8-х символов' })
  password: string;

  @Field(() => String)
  @IsString({ message: 'token должно быть строкой' })
  @IsNotEmpty({ message: 'token не может быть пустым' })
  @MinLength(6, { message: 'token должен быть не менее 6-х символов' })
  token: string;
}
