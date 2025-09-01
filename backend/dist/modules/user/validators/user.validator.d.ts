import { z } from 'zod';
export declare const validatePassword: (password: string) => boolean;
export declare const validatePhoneNumber: (phone: string) => boolean;
export declare const strongPasswordSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const usernameSchema: z.ZodString;
export declare const phoneSchema: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
export declare const nameSchema: z.ZodString;
export declare const emailSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const dateOfBirthSchema: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
export declare const updateProfileSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    phone: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
    dateOfBirth: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
}, "strict", z.ZodTypeAny, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
    dateOfBirth?: string | undefined;
}, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
    dateOfBirth?: string | undefined;
}>;
export declare const createAdminUserSchema: z.ZodObject<{
    email: z.ZodEffects<z.ZodString, string, string>;
    password: z.ZodEffects<z.ZodString, string, string>;
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["USER", "ADMIN"]>>;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "USER" | "ADMIN";
}, {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: "USER" | "ADMIN" | undefined;
}>;
export declare const bulkUserActionSchema: z.ZodObject<{
    userIds: z.ZodArray<z.ZodString, "many">;
    action: z.ZodEnum<["activate", "deactivate", "delete"]>;
}, "strip", z.ZodTypeAny, {
    userIds: string[];
    action: "delete" | "activate" | "deactivate";
}, {
    userIds: string[];
    action: "delete" | "activate" | "deactivate";
}>;
export declare const userSearchFiltersSchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["USER", "ADMIN"]>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    createdAfter: z.ZodOptional<z.ZodString>;
    createdBefore: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sortBy: z.ZodDefault<z.ZodEnum<["createdAt", "updatedAt", "firstName", "lastName", "email"]>>;
    sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortBy: "firstName" | "lastName" | "email" | "createdAt" | "updatedAt";
    sortOrder: "asc" | "desc";
    search?: string | undefined;
    role?: "USER" | "ADMIN" | undefined;
    isActive?: boolean | undefined;
    createdAfter?: string | undefined;
    createdBefore?: string | undefined;
}, {
    search?: string | undefined;
    role?: "USER" | "ADMIN" | undefined;
    isActive?: boolean | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    createdAfter?: string | undefined;
    createdBefore?: string | undefined;
    sortBy?: "firstName" | "lastName" | "email" | "createdAt" | "updatedAt" | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
export type CreateAdminUserDto = z.infer<typeof createAdminUserSchema>;
export type BulkUserActionDto = z.infer<typeof bulkUserActionSchema>;
export type UserSearchFiltersDto = z.infer<typeof userSearchFiltersSchema>;
//# sourceMappingURL=user.validator.d.ts.map