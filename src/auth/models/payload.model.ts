import * as jwt from 'jsonwebtoken';

import { environment } from 'shared/environment';

import { UserModel } from 'db/user';

export interface PayloadModel {
  username: string;
  roles: string[];
}

export namespace PayloadModel {
  export function fromUserModel(user: UserModel): PayloadModel {
    const { username, roles } = user;
    return {
      username,
      roles,
    };
  }

  export function decode(bearer: string): PayloadModel {
    return jwt.decode(bearer) as PayloadModel;
  }

  export function verify(bearer: string): PayloadModel {
    return jwt.verify(bearer, environment.jwt.secret) as PayloadModel;
  }
}
