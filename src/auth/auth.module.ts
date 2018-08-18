import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { UserModule } from 'db/user';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LoginService } from './login.service';
import { JwtGuard } from './jwt.guard';

@Module({
  imports: [UserModule],
  providers: [
    AuthService,
    LoginService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
