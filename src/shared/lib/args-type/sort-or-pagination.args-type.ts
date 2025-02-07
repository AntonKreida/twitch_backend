import { InputType, Field, Int, ArgsType } from '@nestjs/graphql';
import { IsEnum, IsOptional, Min } from 'class-validator';
import { SORT_ENUM } from '../enums';

@InputType()
class PaginationInputType {
  @Field(() => Int, { nullable: true })
  @Min(1, { message: 'Limit должен быть не меньше 1' })
  limit?: number;

  @Field(() => Int, { nullable: true })
  @Min(1, { message: 'Page должен быть не меньше 1' })
  page?: number;
}

@ArgsType()
export class SortOrPaginationArgsType {
  @Field(() => SORT_ENUM, { nullable: true })
  @IsOptional()
  @IsEnum(SORT_ENUM, {
    message: `Сортировка должна значением ${SORT_ENUM.ASC} или ${SORT_ENUM.DESC}`,
  })
  sort?: SORT_ENUM;

  @Field(() => PaginationInputType, { nullable: true })
  @IsOptional()
  pagination?: PaginationInputType;
}
