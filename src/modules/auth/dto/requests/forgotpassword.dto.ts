import { IsString, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  account: string;

  @IsString()
  @MinLength(8, { message: 'Mật khẩu mới phải có ít nhất 8 ký tự' })
  newPassword: string;
}