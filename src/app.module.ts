import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { UserService } from './db/user';

@Module({
  imports: [AuthModule, DbModule],
  providers: [UserService],
})
export class AppModule {}
