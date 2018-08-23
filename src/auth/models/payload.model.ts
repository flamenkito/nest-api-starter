import * as jwt from 'jsonwebtoken';

import { environment } from 'shared/environment';

import { UserEntity } from './user.entity';

export interface PayloadModel {
  username: string;
  roles: string[];
}

export namespace PayloadModel {
  export function fromUserModel(user: UserEntity): PayloadModel {
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
