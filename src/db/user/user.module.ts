import { Module } from '@nestjs/common';

import { userFactory } from './user.factory';
import { UserService } from './user.service';

@Module({
  providers: [userFactory, UserService],
  exports: [userFactory, UserService],
})
export class UserModule {}
