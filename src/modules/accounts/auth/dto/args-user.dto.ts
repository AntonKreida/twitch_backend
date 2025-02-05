import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

@ArgsType()
export class ArgsUserDto {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString({ message: 'id должно быть строкой' })
  id?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'username должно быть строкой' })
  @MinLength(3, { message: 'username должно быть больше 3-х символов' })
  username?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'email должно быть строкой' })
  @IsEmail({}, { message: 'Некорректный email' })
  email?: string;
}
