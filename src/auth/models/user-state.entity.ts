import { Collection, Entity } from 'shared/collection';

@Entity({
  name: '_user_state',
  index: ['username', 'hash'],
  fromArgs: args => UserStateEntity.fromArgs(args),
})
export class UserStateEntity implements Collection.Node {
  _id: string;
  _rev: string;
  type: string;
  // model
  state: {
    place: {
      name: string;
    };
  };
}

export namespace UserStateEntity {
  export function fromArgs(args): UserStateEntity {
    const { state } = args;
    return {
      ...Collection.Node.fromArgs(args),
      state,
    };
  }
}
