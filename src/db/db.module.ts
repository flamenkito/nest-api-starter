import { Module } from '@nestjs/common';

import { UserModule, UserService } from './user';

@Module({
  imports: [UserModule],
  providers: [UserService],
  exports: [],
})
export class DbModule {}
