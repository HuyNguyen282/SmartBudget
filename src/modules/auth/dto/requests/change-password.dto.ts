import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Mật khẩu hiện tại' })
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu hiện tại' })
  oldPassword: string;

  @ApiProperty({ description: 'Mật khẩu mới' })
  @IsString()
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d|(?=.*\W+)).{8,}$/, {
    message: 'Mật khẩu quá yếu. Cần chứa ít nhất 1 ký tự hoa, 1 ký tự thường và 1 số (hoặc ký tự đặc biệt)',
  })
  newPassword: string;

  @ApiProperty({ description: 'Xác nhận mật khẩu mới' })
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng xác nhận lại mật khẩu mới' })
  confirmNewPassword: string;
}