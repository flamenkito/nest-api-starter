import { Injectable, Inject } from '@nestjs/common';

import { compare } from 'bcryptjs';

import { UserService, UserModel } from 'db/user';

import { TokenModel, PayloadModel } from './models';
import { LoginService } from './login.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AsyncUserService') private readonly userService: UserService,
    private readonly loginService: LoginService,
  ) {}

  private async getUser(username: string): Promise<UserModel> {
    const user = await this.userService.getUserByUsername(username);
    if (!user) {
      throw new Error('Invalid user');
    }
    return user;
  }

  async loginUser(username: string, password: string): Promise<TokenModel> {
    const user = await this.getUser(username);
    if (!(await compare(password, user.hash))) {
      throw new Error('Invalid password');
    }
    const token = TokenModel.fromUserModel(user);
    await this.loginService.tryLogin(user, token.accessToken);
    return token;
  }

  async logout(bearer: string): Promise<void> {
    // do not verify, as token could be expired
    const payload = PayloadModel.decode(bearer);
    const user = await this.getUser(payload.username);
    await this.loginService.tryLogout(user, bearer);
  }
}
