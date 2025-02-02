import { User } from '/prisma/generated';

export class UserEntity implements Omit<User, 'id' | 'createAt' | 'updateAt'> {
  id?: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar: string | null;
  bio: string | null;

  constructor(user: User) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.username = user.username;
    this.email = user.email;
    this.avatar = user.avatar || null;
    this.bio = user.bio || null;
  }
}
