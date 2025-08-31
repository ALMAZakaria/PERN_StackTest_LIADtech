import { CreateUserDto, UpdateUserDto, LoginUserDto, ChangePasswordDto, GetUsersQueryDto, UserResponseDto, SimpleCreateUserDto } from '../dto/user.dto';
export declare class UserService {
    private userRepository;
    constructor();
    simpleCreateUser(userData: SimpleCreateUserDto): Promise<UserResponseDto>;
    register(userData: CreateUserDto): Promise<{
        user: UserResponseDto;
        accessToken: string;
        refreshToken: string;
    }>;
    createUser(userData: CreateUserDto): Promise<UserResponseDto>;
    login(credentials: LoginUserDto): Promise<{
        user: UserResponseDto;
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getProfile(userId: string): Promise<UserResponseDto>;
    updateProfile(userId: string, updateData: UpdateUserDto): Promise<UserResponseDto>;
    changePassword(userId: string, passwordData: ChangePasswordDto): Promise<void>;
    getUsers(query: GetUsersQueryDto): Promise<{
        users: UserResponseDto[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUserById(id: string): Promise<UserResponseDto>;
    deleteUser(id: string): Promise<void>;
    private generateTokens;
    private mapToResponseDto;
}
//# sourceMappingURL=user.service.d.ts.map