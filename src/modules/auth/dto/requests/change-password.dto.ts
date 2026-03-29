import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Mật khẩu hiện tại', example: '123456' })
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu cũ' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ description: 'Mật khẩu mới', example: 'PassWordMoi123' })
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu mới' })
  @IsString()
  newPassword: string;

  @ApiProperty({ description: 'Xác nhận mật khẩu mới', example: 'PassWordMoi123' })
  @IsNotEmpty({ message: 'Vui lòng xác nhận mật khẩu mới' })
  @IsString()
  confirmPassword: string;
}