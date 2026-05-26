const logger = require('../utils/logger');

const runMockEvaluation = async (resumeText, jobRequirements, candidateMeta = {}) => {
  logger.info(`Running local AI evaluation for candidate: ${candidateMeta.name || 'Unknown'}`);
  
  // A mock logic that simulates AI evaluation
  const scoreBase = Math.floor(Math.random() * 40) + 60; // 60-100
  
  return {
    matcher: {
      skillMatchScore: Math.min(100, scoreBase + 10),
      experienceScore: Math.min(100, scoreBase + 5),
      skillsMatched: ['JavaScript', 'React', 'Node.js'],
      skillsMissing: ['Docker', 'AWS']
    },
    culture: {
      overallCultureFit: Math.min(100, scoreBase + 15)
    },
    flags: {
      riskScore: Math.max(0, scoreBase - 10),
      flags: []
    }
  };
};

module.exports = {
  runMockEvaluation
};
