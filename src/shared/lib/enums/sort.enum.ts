import { registerEnumType } from '@nestjs/graphql';

export enum SORT_ENUM {
  ASC = 'asc',
  DESC = 'desc',
}

registerEnumType(SORT_ENUM, {
  name: 'SORT_ENUM',
  description: 'Сортировка по возрастанию/убыванию',
});
