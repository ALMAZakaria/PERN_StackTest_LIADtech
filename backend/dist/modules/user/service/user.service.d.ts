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
    createUser(userData: CreateUserDto, currentUserRole?: string): Promise<UserResponseDto>;
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
    getUsers(query: GetUsersQueryDto, currentUserRole?: string): Promise<{
        users: UserResponseDto[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUserById(id: string): Promise<UserResponseDto>;
    updateUser(id: string, updateData: UpdateUserDto, currentUserRole?: string): Promise<UserResponseDto>;
    deleteUser(id: string, currentUserRole?: string, currentUserId?: string): Promise<void>;
    private generateTokens;
    private mapToResponseDto;
}
//# sourceMappingURL=user.service.d.ts.map