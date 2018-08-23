import { Collection, Entity } from 'shared/collection';

@Entity({
  name: '_user_model',
  index: ['username', 'hash'],
  fromArgs: args => UserEntity.fromArgs(args),
})
export class UserEntity implements Collection.Node {
  _id: string;
  _rev: string;
  type: string;
  // model
  username: string;
  hash: string;
  roles: string[];
  instances: number;
}

export namespace UserEntity {
  export function fromArgs(args): UserEntity {
    const { username, hash, roles, instances } = args;
    return {
      ...Collection.Node.fromArgs(args),
      username,
      hash,
      roles,
      instances,
    };
  }
}
