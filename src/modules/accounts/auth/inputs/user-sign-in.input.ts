import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

@InputType()
export class UserSignInInput {
  @Field(() => String)
  @IsString({ message: 'username должно быть строкой' })
  @IsNotEmpty({ message: 'username не может быть пустым' })
  @MinLength(3, { message: 'username должен быть больше 3-х символов' })
  @Matches(/^[a-zA-Z0-9_\s@!#$%^&*()\-+=]{3,}$/, {
    message:
      'login должен состоять только из латинских букв, цифр, пробелы, символов @!#$%^&*()-+=',
  })
  username: string;

  @Field(() => String)
  @IsString({ message: 'password должно быть строкой' })
  @IsNotEmpty({ message: 'password не может быть пустым' })
  @MinLength(8, { message: 'password должен быть больше 8-х символов' })
  password: string;

  @Field(() => String, { nullable: true })
  @IsString({ message: 'pincode должно быть строкой' })
  @IsNotEmpty({ message: 'pincode не может быть пустым' })
  @MinLength(6, { message: 'pincode должен быть не менее 6-х символов' })
  pincode?: string;
}
