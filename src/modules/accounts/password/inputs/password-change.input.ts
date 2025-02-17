import { InputType, Field } from '@nestjs/graphql';
import { MinLength, IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class PasswordChangeInput {
  @Field(() => String, { nullable: false })
  @IsString({ message: 'passwordOld должно быть строкой' })
  @IsNotEmpty({ message: 'passwordOld не может быть пустым' })
  @MinLength(8, { message: 'passwordOld должен быть больше 8-х символов' })
  passwordOld: string;

  @Field(() => String, { nullable: false })
  @IsString({ message: 'passwordNew должно быть строкой' })
  @IsNotEmpty({ message: 'passwordNew не может быть пустым' })
  @MinLength(8, { message: 'passwordNew должен быть больше 8-х символов' })
  passwordNew: string;
}
