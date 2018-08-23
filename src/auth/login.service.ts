import { Injectable } from '@nestjs/common';

import { Collection } from 'shared/collection';

import { PayloadModel, HasTokenModel, UserEntity } from './models';
import { UserStateEntity } from './models';
import { LoggedInModel, LoggedOutModel } from './models';

import { CollectionService } from 'shared/collection';

@Injectable()
export class LoginService {
  private loggedIn: Collection<LoggedInModel>;
  private loggedOut: Collection<LoggedOutModel>;

  constructor(private readonly collection: CollectionService) {
    this.loggedIn = collection.getRemote<LoggedInModel>(LoggedInModel);
    this.loggedOut = collection.getRemote<LoggedOutModel>(LoggedOutModel);
  }

  private isTokenExpired(token: string) {
    try {
      PayloadModel.verify(token);
    } catch (err) {
      const { name = null } = err;
      if (name === 'TokenExpiredError') {
        return true;
      }
    }
    return false;
  }

  private async removeExpiredTokens(db: Collection<HasTokenModel>) {
    db.forEach(async doc => {
      if (this.isTokenExpired(doc.token)) {
        await db.remove(doc);
      }
    });
  }

  private async checkLoggedOut(token: string) {
    const docs = await this.loggedOut.find({ token });
    if (docs.length > 0) {
      throw new Error('User is already logged out');
    }
  }

  private async checkLimit(user: UserEntity) {
    const tokens = await this.loggedIn.find({ userId: user._id });
    if (tokens.length >= user.instances) {
      throw new Error('Too many user instances already has logged in');
    }
  }

  async tryLogin(
    user: UserEntity,
    token: string,
  ): Promise<Collection.RemoteDb> {
    await this.checkLoggedOut(token);
    await this.removeExpiredTokens(this.loggedIn);
    await this.checkLimit(user);
    // add to logged users
    this.loggedIn.post({
      token,
      userId: user._id,
    });
    // setup remote db
    const remoteDb = this.collection.getRemote(UserStateEntity, {
      name: user._id,
      pass: user._id,
    });
    return remoteDb.getRemoteDb();
  }

  async tryLogout(user: UserEntity, token: string) {
    // add to logged out
    const loggedOut = await this.loggedOut.findOne({ token });
    if (!loggedOut) {
      await this.loggedOut.post({ token });
    }
    // remove from logged in
    const loggedIn = await this.loggedIn.findOne({ token });
    if (loggedIn) {
      await this.loggedIn.remove(loggedIn);
    } else {
      // user is already logged out
      if (loggedOut) {
        throw new Error('User is already logged out');
      } else {
        // TODO: blacklist token
      }
    }
    await this.removeExpiredTokens(this.loggedOut);
  }
}
