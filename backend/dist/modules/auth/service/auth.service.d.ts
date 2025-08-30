import { Role } from '@prisma/client';
import { RegisterDto, LoginDto, AuthResponse } from '../dto/auth.dto';
export declare class AuthService {
    private generateTokens;
    register(userData: RegisterDto): Promise<AuthResponse>;
    login(credentials: LoginDto): Promise<AuthResponse>;
    logout(token: string): Promise<void>;
    verifyToken(token: string): Promise<{
        userId: string;
        role: Role;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map