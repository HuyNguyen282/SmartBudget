import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Repository, FindOptionsWhere } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/requests/register-user.dto';
import { LoginDto } from './dto/requests/login.dto';
import { ForgotPasswordDto } from './dto/requests/forgotpassword.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ChangePasswordDto } from './dto/requests/change-password.dto';
import {ResetPasswordDto} from './dto/requests/reset-password.dto'
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>, 
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) { }

  async register(dto: RegisterUserDto): Promise<User> {
    if (!dto.email && !dto.phoneNumber) {
      throw new BadRequestException('Vui lòng nhập email hoặc số điện thoại');
    }

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Mật khẩu nhập lại không khớp');
    }

    const conditions: FindOptionsWhere<User>[] = [];;
    if (dto.email) conditions.push({ email: dto.email });
    if (dto.phoneNumber) conditions.push({ phoneNumber: dto.phoneNumber });
    const existing = await this.usersRepo.findOne({ where: conditions });
    if (existing) throw new ConflictException('Email hoặc số điện thoại đã tồn tại');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = this.usersRepo.create({
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      password: hashedPassword,
      role: 'user', // default role
    });

    return this.usersRepo.save(newUser);
  }

  async validateUser(account: string, pass: string): Promise<User> {
    if (!account || !pass) throw new UnauthorizedException('Invalid credentials');
    const user = await this.usersRepo.findOne({
      where: [
        { email: account },
        { phoneNumber: account }
      ]
    });

    if (!user) {
      throw new NotFoundException('Tài khoản không tồn tại');
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Sai mật khẩu');
    }
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.account, dto.password);
    const payload = { sub: user.id, email: user.email, phoneNumber: user.phoneNumber, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      role: user.role
    };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const { account } = dto;

    const user = await this.usersRepo.findOne({
      where: [{ email: account }, { phoneNumber: account }]
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản với thông tin này');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 3); // 3 minutes


    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = expireTime;
    await this.usersRepo.save(user);


    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Gửi email
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Yêu cầu khôi phục mật khẩu SmartBudget',
      html: `
        <h3>Xin chào!</h3>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu. Vui lòng click vào link bên dưới để đổi mật khẩu mới:</p>
        <a href="${resetLink}" target="_blank">Đổi mật khẩu ngay</a>
        <p>Link này sẽ hết hạn sau 3 phút. Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
      `,
    });

    return { message: 'Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { token, newPassword, confirmNewPassword } = dto;

    if (newPassword !== confirmNewPassword) {
      throw new BadRequestException('Mật khẩu không trùng khớp');
    }

    const user = await this.usersRepo.findOne({ 
      where: { resetPasswordToken: token } 
    });

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Liên kết đã hết hạn hoặc không còn hiệu lực');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.usersRepo.save(user);

    return { message: 'Cập nhật mật khẩu thành công!' };
  }
async changePassword(userId: number, dto: ChangePasswordDto) {
    // 1. Kiểm tra mật khẩu xác nhận
    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new BadRequestException('Mật khẩu xác nhận không khớp');
    }

    // 2. Tìm tài khoản trong Database
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản');
    }

    // 3. Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu cũ không chính xác');
    }

    // 4. Mã hóa mật khẩu mới và lưu lại
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(dto.newPassword, salt);
    await this.usersRepo.save(user);

    return { message: 'Đổi mật khẩu thành công!' };
  }
  async logout(token: string) {
    if (!token) {
      return { message: 'Logged out successfully' };
    }
    try {
      const payload = this.jwtService.decode(token);

    }
    catch (e) {

    }
    return { message: 'Logged out successfully' };
  }
}