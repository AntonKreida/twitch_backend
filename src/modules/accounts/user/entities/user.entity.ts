import { genSalt, hash, compare } from 'bcrypt';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { UserModel } from '../models';
import { IGenerateQrCode } from '../lib';

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
  isDeactivatedAccount?: boolean;
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
    this.isDeactivatedAccount = user?.isDeactivatedAccount;
  }

  public async setPassword(password: string): Promise<UserEntity> {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt);

    return this;
  }

  public async validatePassword(password: string): Promise<boolean> {
    return await compare(password, this.passwordHash);
  }

  public async generateSecretKey(): Promise<UserEntity> {
    const secretKey = await authenticator.generateSecret();

    this.twoFactorSecret = secretKey;
    return this;
  }

  public async generateQrCode(): Promise<IGenerateQrCode> {
    const otpauthUrl = authenticator.keyuri(
      this.email,
      process.env.AUTH_APP_NAME,
      this.twoFactorSecret,
    );

    return {
      qrCode: await toDataURL(otpauthUrl),
    };
  }

  public async enableTwoFactorAuth(): Promise<UserEntity> {
    this.isTwoFactorEnable = true;
    return this;
  }

  public async disableTwoFactorAuth(): Promise<UserEntity> {
    this.isTwoFactorEnable = false;
    this.twoFactorSecret = null;
    return this;
  }

  public async validatePincode(pincode: string): Promise<boolean> {
    return await authenticator.verify({
      token: pincode,
      secret: this.twoFactorSecret,
    });
  }
}
