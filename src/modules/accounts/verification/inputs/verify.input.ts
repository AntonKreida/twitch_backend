import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class VerifyInput {
  @Field(() => String, { nullable: false })
  @IsString({ message: 'token должно быть строкой' })
  @IsNotEmpty({ message: 'token не может быть пустым' })
  @IsUUID('4', { message: 'token должен быть UUID' })
  token: string;
}
