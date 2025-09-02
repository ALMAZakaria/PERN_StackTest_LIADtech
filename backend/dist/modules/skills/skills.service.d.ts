export declare const PREDEFINED_SKILLS: string[];
export declare class SkillsService {
    static getAllSkills(): string[];
    static searchSkills(query: string, limit?: number): string[];
    static validateSkills(skills: string[]): {
        valid: string[];
        invalid: string[];
    };
    static getSkillCategories(): Record<string, string[]>;
    static getPopularSkills(): string[];
}
//# sourceMappingURL=skills.service.d.ts.map