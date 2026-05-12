export declare class User {
    id: number;
    email?: string;
    phoneNumber?: string;
    password: string;
    role: string;
    createdAt: Date;
    username: string;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
}
