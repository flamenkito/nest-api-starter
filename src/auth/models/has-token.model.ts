import { Collection } from 'shared/collection';

export interface HasTokenModel extends Collection.Node {
  token: string;
}

export namespace HasTokenModel {
  export function fromArgs(args): HasTokenModel {
    const { token } = args;
    return { ...Collection.Node.fromArgs(args), token };
  }
}
