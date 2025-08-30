import request from 'supertest';
import app from '../app';
import { SkillsService } from '../modules/skills/skills.service';

describe('Skills API', () => {
  describe('GET /api/v1/skills', () => {
    it('should return all predefined skills', async () => {
      const response = await request(app)
        .get('/api/v1/skills')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data).toContain('React');
      expect(response.body.data).toContain('Node.js');
    });
  });

  describe('GET /api/v1/skills/search', () => {
    it('should search skills with query', async () => {
      const response = await request(app)
        .get('/api/v1/skills/search?query=react')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.some((skill: string) => 
        skill.toLowerCase().includes('react')
      )).toBe(true);
    });

    it('should return limited results', async () => {
      const response = await request(app)
        .get('/api/v1/skills/search?limit=5')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(5);
    });
  });

  describe('POST /api/v1/skills/validate', () => {
    it('should validate skills correctly', async () => {
      const response = await request(app)
        .post('/api/v1/skills/validate')
        .send({
          skills: ['React', 'Node.js', 'InvalidSkill']
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.valid).toContain('React');
      expect(response.body.data.valid).toContain('Node.js');
      expect(response.body.data.invalid).toContain('InvalidSkill');
    });

    it('should handle empty skills array', async () => {
      const response = await request(app)
        .post('/api/v1/skills/validate')
        .send({
          skills: []
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.valid).toEqual([]);
      expect(response.body.data.invalid).toEqual([]);
    });
  });

  describe('GET /api/v1/skills/categories', () => {
    it('should return skill categories', async () => {
      const response = await request(app)
        .get('/api/v1/skills/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('Frontend');
      expect(response.body.data).toHaveProperty('Backend');
      expect(Array.isArray(response.body.data.Frontend)).toBe(true);
    });
  });

  describe('GET /api/v1/skills/popular', () => {
    it('should return popular skills', async () => {
      const response = await request(app)
        .get('/api/v1/skills/popular')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });
});

describe('SkillsService', () => {
  describe('searchSkills', () => {
    it('should filter skills by query', () => {
      const skills = SkillsService.searchSkills('react');
      expect(skills.some(skill => 
        skill.toLowerCase().includes('react')
      )).toBe(true);
    });

    it('should return limited results', () => {
      const skills = SkillsService.searchSkills('', 3);
      expect(skills.length).toBeLessThanOrEqual(3);
    });
  });

  describe('validateSkills', () => {
    it('should separate valid and invalid skills', () => {
      const result = SkillsService.validateSkills(['React', 'InvalidSkill']);
      expect(result.valid).toContain('React');
      expect(result.invalid).toContain('InvalidSkill');
    });
  });
});
