import { CompanyProfile } from '@prisma/client';
export interface CreateCompanyProfileData {
    userId: string;
    companyName: string;
    industry: string;
    size: 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
    description?: string;
    website?: string;
    location?: string;
}
export interface UpdateCompanyProfileData {
    companyName?: string;
    industry?: string;
    size?: 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
    description?: string;
    website?: string;
    location?: string;
}
export declare class CompanyRepository {
    create(data: CreateCompanyProfileData): Promise<CompanyProfile>;
    findByUserId(userId: string): Promise<CompanyProfile | null>;
    update(userId: string, data: UpdateCompanyProfileData): Promise<CompanyProfile>;
    delete(userId: string): Promise<CompanyProfile>;
    findMany(filters?: {
        industry?: string;
        size?: 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
        location?: string;
    }): Promise<CompanyProfile[]>;
}
//# sourceMappingURL=company.repository.d.ts.map