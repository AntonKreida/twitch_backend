import { Social } from '/prisma/generated';

export class SocialEntity implements Partial<Social> {
  id: string;
  title: string;
  url: string;
  position: number;
  createAt?: Date;
  updateAt?: Date;
  userId?: string;

  constructor({ id, title, url, position, userId }: Partial<Social>) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.position = position;
    this.userId = userId;
  }

  async determinePosition(lastSocialPosition: number): Promise<SocialEntity> {
    const position = lastSocialPosition;

    this.position = position > 0 ? position + 1 : 1;

    return this;
  }
}
