import { Injectable } from '@nestjs/common';
import { TokenRepository } from './repositories';
import { ENUM_TYPE_TOKEN, Token, User } from '/prisma/generated';
import { EntityToken } from './entities';

@Injectable()
export class VerificationService {
  constructor(private readonly tokenRepository: TokenRepository) {}

  async sendVerificationToken(
    userId: string,
    typeToken: ENUM_TYPE_TOKEN,
  ): Promise<Token & { user: User }> {
    const oldToken = await this.tokenRepository.findTokenByUserIdAndType(
      userId,
      typeToken,
    );

    if (oldToken) {
      await this.tokenRepository.deleteTokenById(oldToken.id);
    }

    const newToken = new EntityToken({
      type: typeToken,
      userId,
    }).sendToken({ isUUID: true });

    const tokenCreated = await this.tokenRepository.createTokenUserById(
      userId,
      newToken,
    );

    return tokenCreated;
  }
}
