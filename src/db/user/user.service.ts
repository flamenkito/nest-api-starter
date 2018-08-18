import { UserModel } from './models';

export class UserService {
  constructor(private readonly USERS: UserModel[]) {}

  async getUserByUsername(username: string): Promise<UserModel> {
    return this.USERS.find(user => user.username === username);
  }
}
