import { User } from '/prisma/generated';

export type TUserSignUpType = Omit<
  User,
  | 'id'
  | 'createAt'
  | 'updateAt'
  | 'passwordHash'
  | 'isEmailVerification'
  | 'twoFactorSecret'
  | 'isTwoFactorEnable'
  | 'isDeactivatedAccount'
  | 'deactivatedAt'
  | 'avatar'
>;
