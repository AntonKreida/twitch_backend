import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ChangeUpdateSocialInput {
  @Field(() => ID)
  @IsString({ message: 'id должно быть строкой' })
  @IsNotEmpty({ message: 'id не может быть пустым' })
  id: string;

  @Field(() => String)
  @IsString({ message: 'title должно быть строкой' })
  @IsNotEmpty({ message: 'title не может быть пустым' })
  title: string;

  @Field(() => String)
  @IsString({ message: 'url должно быть строкой' })
  @IsNotEmpty({ message: 'url не может быть пустым' })
  url: string;
}
