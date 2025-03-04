import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class ChangeProfileInfoInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({
    message: 'firstName должно быть строкой',
  })
  @IsNotEmpty({ message: 'firstName не может быть пустым' })
  @MinLength(3, { message: 'firstName должно быть больше 3-х символов' })
  firstName?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({
    message: 'lastName должно быть строкой',
  })
  @IsNotEmpty({ message: 'lastName не может быть пустым' })
  @MinLength(3, { message: 'lastName должно быть больше 3-х символов' })
  lastName?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({
    message: 'bio должно быть строкой',
  })
  @IsNotEmpty({ message: 'bio не может быть пустым' })
  @MaxLength(300, { message: 'bio должен быть меньше 300 символов' })
  bio?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({
    message: 'login должен быть строкой',
  })
  @IsNotEmpty({ message: 'username не может быть пустым' })
  @MinLength(3, { message: 'username должен быть больше 3-х символов' })
  @Matches(/^[a-zA-Z0-9_\s@!#$%^&*()\-+=]{3,}$/, {
    message:
      'username должен состоять только из латинских букв, цифр, пробелы, символов @!#$%^&*()-+=',
  })
  username?: string | null;
}
