import { Injectable } from '@nestjs/common';

import { Collection } from 'shared/collection';
import { UserModel } from 'db/user';

import { PayloadModel, HasTokenModel } from './models';
import { LoggedInModel, LoggedOutModel } from './models';

@Injectable()
export class LoginService {
  private loggedIn = LoggedInModel.getCollection();
  private loggedOut = LoggedOutModel.getCollection();

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

  private async checkLimit(user: UserModel) {
    const tokens = await this.loggedIn.find({ userId: user.id });
    if (tokens.length >= user.instances) {
      throw new Error('Too many user instances already has logged in');
    }
  }

  async tryLogin(user: UserModel, token: string) {
    await this.checkLoggedOut(token);
    await this.removeExpiredTokens(this.loggedIn);
    await this.checkLimit(user);
    // add to logged users
    this.loggedIn.post({
      token,
      userId: user.id,
    });
  }

  async tryLogout(user: UserModel, token: string) {
    await this.removeExpiredTokens(this.loggedOut);
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
        throw new Error('User is already logged in');
      } else {
        // TODO: blacklist token
      }
    }
  }
}
