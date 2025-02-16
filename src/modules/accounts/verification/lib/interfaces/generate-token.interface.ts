import { ENUM_TYPE_TOKEN } from '/prisma/generated';

export interface IGenerateToken {
  userId: string;
  typeToken: ENUM_TYPE_TOKEN;
  isUUID?: boolean;
}
