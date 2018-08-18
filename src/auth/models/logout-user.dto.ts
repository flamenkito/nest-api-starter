import { IsString, IsOptional } from 'class-validator';

export class LogoutUserDto {
  @IsOptional()
  @IsString()
  username: string;
}
