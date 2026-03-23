import { IsString, MinLength, IsOptional, IsEmail } from 'class-validator';

export class RegisterUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  role?: string; 
  confirmPassword: string;
}