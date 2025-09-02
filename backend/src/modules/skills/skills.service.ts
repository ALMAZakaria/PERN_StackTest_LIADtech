// Predefined skills for SkillBridge Pro
export const PREDEFINED_SKILLS = [
  // Frontend Technologies
  'React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Sass', 'Less',
  'Next.js', 'Nuxt.js', 'Gatsby', 'Tailwind CSS', 'Bootstrap', 'Material-UI', 'Ant Design',
  
  // Backend Technologies
  'Node.js', 'Express.js', 'NestJS', 'Python', 'Django', 'Flask', 'FastAPI', 'Java', 'Spring Boot',
  'C#', '.NET', 'ASP.NET Core', 'PHP', 'Laravel', 'Symfony', 'Ruby', 'Ruby on Rails', 'Go',
  
  // Databases
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'DynamoDB',
  
  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'GitLab CI',
  'GitHub Actions', 'Ansible', 'Nginx', 'Apache',
  
  // Mobile Development
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'Xamarin', 'Ionic',
  
  // Data Science & AI
  'Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Jupyter', 'R',
  'Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP',
  
  // Blockchain
  'Solidity', 'Ethereum', 'Bitcoin', 'Hyperledger', 'Web3.js',
  
  // Other Technologies
  'GraphQL', 'REST API', 'WebSocket', 'Microservices', 'Serverless', 'GraphQL', 'gRPC',
  'Elasticsearch', 'Kafka', 'RabbitMQ', 'Redis', 'Memcached'
];

export class SkillsService {
  /**
   * Get all predefined skills
   */
  static getAllSkills(): string[] {
    return [...PREDEFINED_SKILLS];
  }

  /**
   * Search skills with autocomplete
   */
  static searchSkills(query: string, limit: number = 10): string[] {
    if (!query || query.trim().length === 0) {
      return PREDEFINED_SKILLS.slice(0, limit);
    }

    const searchTerm = query.toLowerCase().trim();
    return PREDEFINED_SKILLS
      .filter(skill => skill.toLowerCase().includes(searchTerm))
      .slice(0, limit);
  }

  /**
   * Validate skills against predefined list
   */
  static validateSkills(skills: string[]): { valid: string[], invalid: string[] } {
    const valid: string[] = [];
    const invalid: string[] = [];

    skills.forEach(skill => {
      if (PREDEFINED_SKILLS.includes(skill)) {
        valid.push(skill);
      } else {
        invalid.push(skill);
      }
    });

    return { valid, invalid };
  }

  /**
   * Get skill categories
   */
  static getSkillCategories(): Record<string, string[]> {
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

  /**
   * Get popular skills (most commonly used)
   */
  static getPopularSkills(): string[] {
    return [
      'React', 'Node.js', 'TypeScript', 'Python', 'JavaScript', 'PostgreSQL',
      'AWS', 'Docker', 'MongoDB', 'Express.js', 'Vue.js', 'Angular'
    ];
  }
}
