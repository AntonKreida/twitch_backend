import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ChangeInfoStreamInput {
  @IsString({ message: 'streamId должно быть строкой' })
  @IsNotEmpty({ message: 'streamId не может быть пустым' })
  @Field(() => String)
  title: string;
}
