import * as jwt from 'jsonwebtoken';

import { environment } from 'shared/environment';
import { UserModel } from 'db/user';

import { PayloadModel } from './payload.model';

export interface TokenModel {
  accessToken: string;
  expiresIn: number;
}

export namespace TokenModel {
  export function fromUserModel(user: UserModel) {
    const payload = PayloadModel.fromUserModel(user);
    const { secret, expiresIn } = environment.jwt;
    const accessToken = jwt.sign(payload, secret, { expiresIn });
    return {
      accessToken,
      expiresIn,
    };
  }
}
