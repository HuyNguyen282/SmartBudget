import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/requests/register-user.dto';
import { LoginDto } from './dto/requests/login.dto';
import { ForgotPasswordDto } from './dto/requests/forgotpassword.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterUserDto): Promise<import("./entities/user.entity").User>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        role: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    logout(req: any): Promise<{
        message: string;
        user_id: any;
    }>;
}
