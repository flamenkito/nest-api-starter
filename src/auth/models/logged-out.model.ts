import { Entity } from 'shared/collection';

import { HasTokenModel } from './has-token.model';

@Entity({
  name: '_logged_out',
  index: ['token'],
  fromArgs: args => LoggedOutModel.fromArgs(args),
})
export class LoggedOutModel implements HasTokenModel {
  _id: string;
  _rev: string;
  type: string;
  // has token
  token: string;
}

export namespace LoggedOutModel {
  export function fromArgs(args): LoggedOutModel {
    return HasTokenModel.fromArgs(args);
  }
}
