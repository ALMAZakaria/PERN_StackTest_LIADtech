"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsService = exports.PREDEFINED_SKILLS = void 0;
exports.PREDEFINED_SKILLS = [
    'React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Sass', 'Less',
    'Next.js', 'Nuxt.js', 'Gatsby', 'Tailwind CSS', 'Bootstrap', 'Material-UI', 'Ant Design',
    'Node.js', 'Express.js', 'NestJS', 'Python', 'Django', 'Flask', 'FastAPI', 'Java', 'Spring Boot',
    'C#', '.NET', 'ASP.NET Core', 'PHP', 'Laravel', 'Symfony', 'Ruby', 'Ruby on Rails', 'Go',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'DynamoDB',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'GitLab CI',
    'GitHub Actions', 'Ansible', 'Nginx', 'Apache',
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'Xamarin', 'Ionic',
    'Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Jupyter', 'R',
    'Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP',
    'Solidity', 'Ethereum', 'Bitcoin', 'Hyperledger', 'Web3.js',
    'GraphQL', 'REST API', 'WebSocket', 'Microservices', 'Serverless', 'GraphQL', 'gRPC',
    'Elasticsearch', 'Kafka', 'RabbitMQ', 'Redis', 'Memcached'
];
class SkillsService {
    static getAllSkills() {
        return [...exports.PREDEFINED_SKILLS];
    }
    static searchSkills(query, limit = 10) {
        if (!query || query.trim().length === 0) {
            return exports.PREDEFINED_SKILLS.slice(0, limit);
        }
        const searchTerm = query.toLowerCase().trim();
        return exports.PREDEFINED_SKILLS
            .filter(skill => skill.toLowerCase().includes(searchTerm))
            .slice(0, limit);
    }
    static validateSkills(skills) {
        const valid = [];
        const invalid = [];
        skills.forEach(skill => {
            if (exports.PREDEFINED_SKILLS.includes(skill)) {
                valid.push(skill);
            }
            else {
                invalid.push(skill);
            }
        });
        return { valid, invalid };
    }
    static getSkillCategories() {
        return {
            'Frontend': ['React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3'],
            'Backend': ['Node.js', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go'],
            'Database': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
            'Cloud & DevOps': ['AWS', 'Azure', 'Docker', 'Kubernetes'],
            'Mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin'],
            'Data Science': ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning'],
            'Blockchain': ['Solidity', 'Ethereum', 'Web3.js']
        };
    }
    static getPopularSkills() {
        return [
            'React', 'Node.js', 'TypeScript', 'Python', 'JavaScript', 'PostgreSQL',
            'AWS', 'Docker', 'MongoDB', 'Express.js', 'Vue.js', 'Angular'
        ];
    }
}
exports.SkillsService = SkillsService;
//# sourceMappingURL=skills.service.js.map