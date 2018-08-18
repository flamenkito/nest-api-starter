import { Collection } from 'shared/collection';

export interface HasTokenModel extends Collection.NodeModel {
  token: string;
}

export namespace HasTokenModel {
  export function fromArgs(args): HasTokenModel {
    const { token } = args;
    return { ...Collection.NodeModel.fromArgs(args), token };
  }
}
