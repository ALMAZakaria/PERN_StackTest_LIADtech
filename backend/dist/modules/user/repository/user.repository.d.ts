import { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto, GetUsersQueryDto } from '../dto/user.dto';
export declare class UserRepository {
    create(data: CreateUserDto & {
        password: string;
    }): Promise<User>;
    createWithRole(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: string;
    }): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findMany(query: GetUsersQueryDto): Promise<{
        users: User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    update(id: string, data: UpdateUserDto): Promise<User>;
    updatePassword(id: string, hashedPassword: string): Promise<User>;
    delete(id: string): Promise<User>;
    hardDelete(id: string): Promise<User>;
    existsByEmail(email: string, excludeId?: string): Promise<boolean>;
}
//# sourceMappingURL=user.repository.d.ts.map