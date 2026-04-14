import { IsString, IsNotEmpty} from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập email hoặc số điện thoại' })
  account: string;

}