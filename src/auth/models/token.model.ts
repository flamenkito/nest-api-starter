import * as jwt from 'jsonwebtoken';

import { environment } from 'shared/environment';

import { PayloadModel } from './payload.model';
import { UserEntity } from './user.entity';

export interface TokenModel {
  accessToken: string;
  expiresIn: number;
}

export namespace TokenModel {
  export function fromUserEntity(user: UserEntity): TokenModel {
    const payload = PayloadModel.fromUserModel(user);
    const { secret, expiresIn } = environment.jwt;
    const accessToken = jwt.sign(payload, secret, { expiresIn });
    return {
      accessToken,
      expiresIn,
    };
  }
}
