import { UserResponseDto } from '../dto/user.dto';
export declare class UserCache {
    private readonly USER_KEY_PREFIX;
    private readonly USER_LIST_KEY_PREFIX;
    private readonly TTL;
    private getUserKey;
    private getUserListKey;
    getUser(id: string): Promise<UserResponseDto | null>;
    setUser(id: string, user: UserResponseDto): Promise<void>;
    getUserList(query: string): Promise<any | null>;
    setUserList(query: string, data: any): Promise<void>;
    deleteUser(id: string): Promise<void>;
    clearUserCaches(id?: string): Promise<void>;
    private clearUserListCaches;
}
//# sourceMappingURL=user.cache.d.ts.map