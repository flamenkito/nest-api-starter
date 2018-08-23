import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { ConfigService } from 'shared/config.service';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LoginService } from './login.service';
import { JwtGuard } from './jwt.guard';
import { CollectionService } from 'shared/collection';

@Module({
  imports: [],
  providers: [
    AuthService,
    LoginService,
    ConfigService,
    CollectionService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
