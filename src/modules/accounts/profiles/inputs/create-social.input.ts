import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateSocialInput {
  @Field(() => String)
  @IsString({ message: 'url должно быть строкой' })
  @IsNotEmpty({ message: 'url не может быть пустым' })
  url: string;

  @Field(() => String)
  @IsString({ message: 'title должно быть строкой' })
  @IsNotEmpty({ message: 'title не может быть пустым' })
  title: string;
}
