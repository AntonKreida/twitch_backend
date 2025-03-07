import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class ChangeReorderSocialInput {
  @Field(() => String)
  @IsString({ message: 'id должно быть строкой' })
  @IsNotEmpty({ message: 'id не может быть пустым' })
  id: string;

  @Field(() => Number)
  @IsNumber({}, { message: 'position должно быть числом' })
  @IsNotEmpty({ message: 'position не может быть пустым' })
  position: number;
}
