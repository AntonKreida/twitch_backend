import { ArgsType, Field } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationInputType, SORT_ENUM } from '@shared';

@ArgsType()
export class ArgsUsersDto {
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
