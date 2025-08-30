import { CreateCompanyProfileData, UpdateCompanyProfileData } from '../repository/company.repository';
export declare class CompanyService {
    private companyRepository;
    constructor();
    createProfile(userId: string, data: CreateCompanyProfileData): Promise<any>;
    getProfile(userId: string): Promise<any>;
    updateProfile(userId: string, data: UpdateCompanyProfileData): Promise<any>;
    deleteProfile(userId: string): Promise<void>;
    searchCompanies(filters?: {
        industry?: string;
        size?: 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
        location?: string;
    }): Promise<any[]>;
    getCompanyStats(userId: string): Promise<any>;
}
//# sourceMappingURL=company.service.d.ts.map