export declare const testUtils: {
    createTestUser(userData: {
        email: string;
        password?: string;
        firstName?: string;
        lastName?: string;
        role?: "USER" | "ADMIN";
        userType?: "FREELANCER" | "COMPANY";
    }): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        id: string;
        userType: import(".prisma/client").$Enums.UserType;
        createdAt: Date;
        updatedAt: Date;
    }>;
    cleanupTestData(): Promise<void>;
    generateTestData(): {
        freelancer: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            userType: "FREELANCER";
            skills: string[];
            dailyRate: number;
            availability: number;
            experience: number;
        };
        company: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            userType: "COMPANY";
            companyName: string;
            industry: string;
            companySize: "MEDIUM";
        };
        invalidData: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            userType: string;
        };
    };
    validateTokenFormat(token: string): boolean;
    extractToken(response: any): any;
    createAuthHeader(token: string): {
        Authorization: string;
    };
};
export declare const setupTestDatabase: () => Promise<void>;
export declare const teardownTestDatabase: () => Promise<void>;
export declare const TEST_CONSTANTS: {
    VALID_PASSWORD: string;
    INVALID_PASSWORD: string;
    TEST_EMAILS: {
        FREELANCER: string;
        COMPANY: string;
        ADMIN: string;
        USER: string;
    };
    EXPECTED_MESSAGES: {
        REGISTER_SUCCESS: string;
        LOGIN_SUCCESS: string;
        LOGOUT_SUCCESS: string;
        INVALID_CREDENTIALS: string;
        USER_EXISTS: string;
        ACCESS_TOKEN_REQUIRED: string;
        INVALID_TOKEN: string;
    };
};
//# sourceMappingURL=auth-routes.setup.d.ts.map