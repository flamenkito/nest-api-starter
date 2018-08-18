import { Collection } from 'shared/collection';

import { HasTokenModel } from './has-token.model';

export interface LoggedInModel extends HasTokenModel {
  userId: string;
}

export namespace LoggedInModel {
  export const getCollection = () =>
    new Collection<LoggedInModel>(
      '_logged_in',
      ['userId', 'token'],
      LoggedInModel.fromArgs,
    );

  export function fromArgs(args): LoggedInModel {
    const { userId } = args;
    return { ...HasTokenModel.fromArgs(args), userId };
  }
}
