import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class SendDeactivatedEmailInput {
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
  email: string;
}
