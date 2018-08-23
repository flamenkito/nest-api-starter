import { Injectable } from '@nestjs/common';

import { compare } from 'bcryptjs';

import { TokenModel, PayloadModel, UserEntity } from './models';
import { LoginService } from './login.service';
import { Collection, CollectionService } from 'shared/collection';

@Injectable()
export class AuthService {
  private users: Collection<UserEntity>;

  constructor(
    private readonly collection: CollectionService,
    private readonly loginService: LoginService,
  ) {
    this.users = collection.getRemote<UserEntity>(UserEntity);
  }

  private async getUser(username: string): Promise<UserEntity> {
    const user = this.users.findOne({ username });
    if (!user) {
      throw new Error('Invalid user');
    }
    return user;
  }

  async loginUser(username: string, password: string): Promise<LoginResponse> {
    const user = await this.getUser(username);
    if (!(await compare(password, user.hash))) {
      throw new Error('Invalid password');
    }
    const token = TokenModel.fromUserEntity(user);
    const remoteDbOptions = await this.loginService.tryLogin(user, token.accessToken);
    return { token, remoteDbOptions };
  }

  async logout(bearer: string): Promise<void> {
    // do not verify, as token could be expired
    const payload = PayloadModel.decode(bearer);
    const user = await this.getUser(payload.username);
    await this.loginService.tryLogout(user, bearer);
  }
}

interface LoginResponse {
  token: TokenModel;
  remoteDbOptions: Collection.RemoteDb;
}
