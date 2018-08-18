import { genSalt, hash } from 'bcryptjs';

import { UserModel } from './models';
import { UserService } from './user.service';

export const userFactory = {
  provide: 'AsyncUserService',
  useFactory: async () => {
    const salt = await genSalt();

    const USERS: UserModel[] = [
      {
        id: 'user-1',
        username: 'admin',
        hash: await hash('secret', salt),
        roles: ['admin'],
        instances: 1,
      },
      {
        id: 'user-2',
        username: 'user',
        hash: await hash('secret', salt),
        roles: ['user'],
        instances: 3,
      },
    ];

    return new UserService(USERS);
  },
};
