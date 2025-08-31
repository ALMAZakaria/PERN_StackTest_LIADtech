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
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}, {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
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
}, "strip", z.ZodTypeAny, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
}, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
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
    role: z.ZodOptional<z.ZodEnum<["USER", "ADMIN"]>>;
    isActive: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    role?: "USER" | "ADMIN" | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    isActive?: boolean | undefined;
}, {
    search?: string | undefined;
    role?: "USER" | "ADMIN" | undefined;
    page?: string | undefined;
    limit?: string | undefined;
    isActive?: string | undefined;
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