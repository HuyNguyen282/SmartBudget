import { Controller, Post, Body, UseGuards, Headers, Req, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request } from 'express';
import { RegisterUserDto } from './dto/requests/register-user.dto';
import { LoginDto } from './dto/requests/login.dto';
import { ForgotPasswordDto } from './dto/requests/forgotpassword.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiOperation, ApiBody } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/requests/change-password.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Gửi yêu cầu khôi phục mật khẩu (quên mật khẩu)' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('change-password')
  @ApiOperation({ summary: 'Đổi mật khẩu' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(@Body() dto: ChangePasswordDto, @Req() req: any) {
    
    // Đã sửa thành req.user.userId để khớp 100% với file jwt.strategy.ts
    const userId = req.user.userId; 

    if (!userId) {
      throw new BadRequestException('Token không hợp lệ hoặc thiếu thông tin người dùng.');
    }

    return this.authService.changePassword(userId, dto);
  }
  @Post('reset-password')
  @ApiOperation({ summary: 'Đặt lại mật khẩu mới ' })
  resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }
  @UseGuards(JwtAuthGuard) 
  @ApiBearerAuth()        
  @Post('logout')
  async logout(@Req() req: any) {
    console.log('>>> LOGOUT HIT, User data:', req.user);


    return this.authService.logout(req.user);
  }
}