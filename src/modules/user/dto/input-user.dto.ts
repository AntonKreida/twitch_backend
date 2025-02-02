import { InputType, Field } from '@nestjs/graphql';
import { User } from '/prisma/generated';
import { IsEmail, IsOptional, Min } from 'class-validator';

@InputType()
export class InputUserDto
  implements Omit<User, 'id' | 'createAt' | 'updateAt'>
{
  @Field(() => String)
  @Min(3, { message: 'Имя должно быть больше 3-х символов' })
  firstName: string;

  @Field(() => String)
  @Min(3, { message: 'Фамилия должна быть больше 3-х символов' })
  lastName: string;

  @Field(() => String)
  @IsEmail(
    {},
    {
      message: 'Некорректный email',
    },
  )
  email: string;

  @Field(() => String)
  @Min(3, { message: 'Логин должен быть больше 3-х символов' })
  username: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  avatar: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  bio: string | null;
}
