import { Collection } from 'shared/collection';

import { HasTokenModel } from './has-token.model';

export interface LoggedOutModel extends HasTokenModel {}

export namespace LoggedOutModel {
  export const getCollection = () =>
    new Collection<LoggedOutModel>(
      '_logged_out',
      ['token'],
      LoggedOutModel.fromArgs,
    );

  export function fromArgs(args): LoggedOutModel {
    return HasTokenModel.fromArgs(args);
  }
}
