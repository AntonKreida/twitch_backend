import { InputType, Field } from '@nestjs/graphql';
import { IsString, MinLength, IsNotEmpty } from 'class-validator';

@InputType()
export class SendGeneratedQrCodeInput {
  @Field(() => String)
  @IsString({ message: 'token должно быть строкой' })
  @IsNotEmpty({ message: 'token не может быть пустым' })
  @MinLength(6, { message: 'token должен быть не менее 6-х символов' })
  token: string;
}
