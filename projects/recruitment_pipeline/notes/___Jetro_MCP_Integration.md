### `jetroService.js`
```javascript
const axios = require('axios');
const logger = require('../utils/logger');

// Jetro client configuration
const JETRO_API_KEY = process.env.JETRO_API_KEY;
const JETRO_API_URL = process.env.JETRO_API_URL || 'https://api.jetro.ai';

const SKILLS_DB = [
  'Node.js', 'Node', 'React', 'React.js', 'PostgreSQL', 'Postgres', 'Docker', 'AWS', 'Kubernetes',
  'JavaScript', 'JS', 'TypeScript', 'TS', 'Python', 'Go', 'Java', 'SQL', 'NoSQL', 'MongoDB',
  'Redis', 'Express', 'Express.js', 'HTML', 'CSS', 'SaaS', 'CI/CD', 'Git', 'GitHub', 'System Design'
];

const runMockWorkflow = (resumeText, jobRequirements, candidateMeta = {}) => {
  logger.info(`Running local heuristic evaluation for candidate: ${candidateMeta.name || 'Unknown'}`);
  const text = resumeText.toLowerCase();

  // DYNAMIC PARSING FOR CUSTOM UPLOADED RESUMES (Heuristics Engine)
  
  // Extract Skills
  const extractedSkills = [];
  SKILLS_DB.forEach(skill => {
    const regex = new RegExp(`\\b${skill.replace('.', '\\.')}\\b`, 'i');
    if (regex.test(text)) {
      // Estimate years of experience randomly between 1 and 6, or look for patterns in resume text
      const yearsMatch = text.match(new RegExp(`${skill}\\s*(?:for)?\\s*(\\d+)\\s*(?:year|yr)`, 'i'));
      const years = yearsMatch ? parseInt(yearsMatch[1], 10) : Math.floor(Math.random() * 4) + 1;
      
      let level = 'Intermediate';
      if (years >= 4) level = 'Expert';
      else if (years >= 2) level = 'Advanced';
      
      extractedSkills.push({ name: skill, level, yearsOfExperience: years });
    }
  });

  // Extract Experience
  const expMatch = text.match(/(?:experience|employment|work history)([\s\S]*?)(?:education|skills|certifications|$)/i);
  let parsedExperience = [];
  if (expMatch && expMatch[1]) {
    const lines = expMatch[1].split('\n').map(l => l.trim()).filter(l => l.length > 5);
    // Group lines into mock experience entries
    if (lines.length > 0) {
      parsedExperience.push({
        title: lines[0].substring(0, 40),
    

// ... (truncated for workspace view)
```