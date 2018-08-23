import { Entity } from 'shared/collection';

import { HasTokenModel } from './has-token.model';

@Entity({
  name: '_logged_in',
  index: ['token', 'userId'],
  fromArgs: args => LoggedInModel.fromArgs(args),
})
export class LoggedInModel implements HasTokenModel {
  _id: string;
  _rev: string;
  type: string;
  // has token
  token: string;
  // model
  userId: string;
}

export namespace LoggedInModel {
  export function fromArgs(args): LoggedInModel {
    const { userId } = args;
    return { ...HasTokenModel.fromArgs(args), userId };
  }
}
