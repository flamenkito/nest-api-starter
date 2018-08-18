import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { Post, Delete } from '@nestjs/common';
import { UsePipes, ValidationPipe, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserDto, LogoutUserDto, PayloadModel } from './models';
import { Access, Allow, Payload, Bearer } from './decorators';

import * as clc from 'cli-color';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Access(Allow.PUBLIC)
  @UsePipes(new ValidationPipe())
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    try {
      const { username, password } = loginUserDto;
      return await this.authService.loginUser(username, password);
    } catch (error) {
      const { message = 'Unauthorized' } = error;
      console.log(clc.red('AuthController.loginUser'), message);
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('logout')
  @Access(Allow.PUBLIC)
  async logout(@Bearer() bearer: string) {
    try {
      return await this.authService.logout(bearer);
    } catch (error) {
      const { message = "Can't logout user" } = error;
      console.log(clc.red('AuthController.logoutUser'), message);
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Delete('logout')
  @Access(Allow.ADMIN)
  @UsePipes(new ValidationPipe())
  async logoutUser(
    @Body() logoutUserDto: LogoutUserDto,
    @Payload() payload: PayloadModel,
    @Bearer() bearer: string,
  ) {
    try {
      const { username } = logoutUserDto;
    } catch (err) {
      throw new HttpException("Can't logout user", HttpStatus.UNAUTHORIZED);
    }
  }
}
