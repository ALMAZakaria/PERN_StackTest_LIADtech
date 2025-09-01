import { z } from 'zod';
export declare const simpleCreateUserSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["user", "admin", "moderator"]>>;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "user" | "admin" | "moderator";
}, {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: "user" | "admin" | "moderator" | undefined;
}>;
export type SimpleCreateUserDto = z.infer<typeof simpleCreateUserSchema>;
export declare const createUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodOptional<z.ZodEnum<["USER", "ADMIN", "MODERATOR"]>>;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: "USER" | "ADMIN" | "MODERATOR" | undefined;
}, {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: "USER" | "ADMIN" | "MODERATOR" | undefined;
}>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
export declare const loginUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginUserDto = z.infer<typeof loginUserSchema>;
export declare const updateUserSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["USER", "ADMIN", "MODERATOR"]>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
    role?: "USER" | "ADMIN" | "MODERATOR" | undefined;
    isActive?: boolean | undefined;
}, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
    role?: "USER" | "ADMIN" | "MODERATOR" | undefined;
    isActive?: boolean | undefined;
}>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export declare const changePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
}>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
export declare const getUsersQuerySchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    search: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["USER", "ADMIN", "MODERATOR"]>>;
    isActive: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    role?: "USER" | "ADMIN" | "MODERATOR" | undefined;
    isActive?: boolean | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}, {
    search?: string | undefined;
    role?: "USER" | "ADMIN" | "MODERATOR" | undefined;
    isActive?: string | undefined;
    page?: string | undefined;
    limit?: string | undefined;
}>;
export type GetUsersQueryDto = z.infer<typeof getUsersQuerySchema>;
export declare const userIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export type UserIdParamDto = z.infer<typeof userIdParamSchema>;
export interface UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=user.dto.d.ts.map