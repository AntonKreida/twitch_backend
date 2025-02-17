import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

@InputType()
export class PasswordRecoveryInput {
  @Field(() => String, { nullable: false })
  @IsString({ message: 'email должно быть строкой' })
  @IsNotEmpty({ message: 'email не может быть пустым' })
  @MinLength(3, { message: 'email должен быть больше 3-х символов' })
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;
}
