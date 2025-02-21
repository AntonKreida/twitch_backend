import { genSalt, hash, compare } from 'bcrypt';
import { UserModel } from '../models';

type TEntityUser = Partial<Omit<UserModel, 'createAt' | 'updateAt'>>;

export class UserEntity implements TEntityUser {
  id?: string | null;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  passwordHash: string;
  isEmailVerification?: boolean;
  isTwoFactorEnable?: boolean;
  twoFactorSecret?: string | null;

  constructor(user: TEntityUser) {
    this.id = user?.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.username = user.username;
    this.email = user.email;
    this.avatar = user.avatar || null;
    this.bio = user.bio || null;
    this.passwordHash = user.passwordHash;
    this.isEmailVerification = user?.isEmailVerification;
    this.isTwoFactorEnable = user?.isTwoFactorEnable;
    this.twoFactorSecret = user?.twoFactorSecret;
  }

  public async setPassword(password: string): Promise<UserEntity> {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt);

    return this;
  }

  public async validatePassword(password: string): Promise<boolean> {
    return await compare(password, this.passwordHash);
  }
}
