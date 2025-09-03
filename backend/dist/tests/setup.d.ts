declare global {
    namespace jest {
        interface Matchers<R> {
            toBeValidApiResponse(): R;
            toHaveValidToken(): R;
        }
    }
    var testUtils: {
        createTestUser: (overrides?: any) => any;
        getAdminCredentials: () => {
            email: string;
            password: string;
        };
        getFreelancerCredentials: () => {
            email: string;
            password: string;
        };
        getCompanyCredentials: () => {
            email: string;
            password: string;
        };
        extractToken: (authResponse: any) => string;
        createAuthHeader: (token: string) => {
            Authorization: string;
        };
    };
}
export {};
//# sourceMappingURL=setup.d.ts.map