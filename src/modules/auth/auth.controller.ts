import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/requests/register-user.dto';
import { LoginDto } from './dto/requests/login.dto';
import {ForgotPasswordDto} from './dto/requests/forgotpassword.dto';
import {ChangePasswordDto} from './dto/requests/change-password.dto'
import {ResetPasswordDto} from './dto/requests/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiOperation, ApiBody, ApiBearerAuth} from '@nestjs/swagger';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Quên mật khẩu' })
  @ApiBody({ type: ForgotPasswordDto }) 
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Đặt lại mật khẩu mới bằng Token' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('change-password')
  @ApiBearerAuth() 
  @UseGuards(JwtAuthGuard) 
  @ApiOperation({ summary: 'Đổi mật khẩu' })
  async changePassword(@Body() dto: ChangePasswordDto, @Request() req: any) {
    const userId = req.user.id; 
    return this.authService.changePassword(userId, dto);
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req) {
    return this.authService.logout(req.user);
  }
}

