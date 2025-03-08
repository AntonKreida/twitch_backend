import { Field, InputType } from '@nestjs/graphql';
import { PaginationInputType } from '@shared';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class SearchStreamInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'search должно быть строкой' })
  @IsNotEmpty({ message: 'search не может быть пустым' })
  search: string | null;

  @Field(() => PaginationInputType, { nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'pagination не может быть пустым' })
  pagination: PaginationInputType;
}
