import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/requests/register-user.dto';
import { LoginDto } from './dto/requests/login.dto';
import { ForgotPasswordDto } from './dto/requests/forgotpassword.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from './dto/requests/reset-password.dto';
import { ChangePasswordDto } from './dto/requests/change-password.dto';
export declare class AuthService {
    private usersRepo;
    private jwtService;
    private mailerService;
    constructor(usersRepo: Repository<User>, jwtService: JwtService, mailerService: MailerService);
    register(dto: RegisterUserDto): Promise<User>;
    validateUser(account: string, pass: string): Promise<User>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        role: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    changePassword(userId: number, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    logout(user: any): Promise<{
        message: string;
        user_id: any;
    }>;
}
