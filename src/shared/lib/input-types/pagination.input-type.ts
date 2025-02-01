import { InputType, Field, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';

@InputType()
export class PaginationInputType {
  @Field(() => Int, { nullable: true })
  @Min(1, { message: 'Limit должен быть не меньше 1' })
  limit?: number;

  @Field(() => Int, { nullable: true })
  @Min(1, { message: 'Page должен быть не меньше 1' })
  page?: number;
}
