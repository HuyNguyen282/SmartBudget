import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/requests/register-user.dto';
import { LoginDto } from './dto/requests/login.dto';
import {ForgotPasswordDto} from './dto/requests/forgotpassword.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto): Promise<User> {
    if (!dto.email && !dto.phoneNumber) {
      throw new BadRequestException('Vui lòng nhập email hoặc số điện thoại');
    }

    if (dto.password !== dto.confirmPassword) {
    throw new BadRequestException('Mật khẩu nhập lại không khớp');
  }

    const conditions: Partial<User>[] = [];
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
      ]});

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
    const payload = { sub: user.id, email: user.email, phoneNumber: user.phoneNumber,role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      role: user.role
    };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const { account, newPassword } = dto;

    // 1. Tìm user bằng email hoặc phoneNumber
    const user = await this.usersRepo.findOne({
      where: [{ email: account }, { phoneNumber: account }]
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản với thông tin này');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await this.usersRepo.save(user);

    return { message: 'Đổi mật khẩu thành công!' };
  }

  async logout(user: any){
    return {
      message: "Đăng xuất thành công",
      user_id: user.userId,
    }
  }
}

