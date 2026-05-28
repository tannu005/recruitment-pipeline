const logger = require('../utils/logger');

const crypto = require('crypto');

const runMockEvaluation = async (resumeText, jobRequirements, candidateMeta = {}) => {
  logger.info(`Running local AI evaluation for candidate: ${candidateMeta.name || 'Unknown'}`);
  
  let scoreBase = 70;
  const textLower = (resumeText || '').toLowerCase();
  
  const matchedSkills = [];
  const missingSkills = [];
  
  // Basic keyword matching logic
  if (jobRequirements && jobRequirements.skills && Array.isArray(jobRequirements.skills)) {
    jobRequirements.skills.forEach(skill => {
      if (textLower.includes(skill.toLowerCase())) {
        matchedSkills.push(skill);
        scoreBase += 5;
      } else {
        missingSkills.push(skill);
        scoreBase -= 3;
      }
    });
  }

  // Cap base score
  scoreBase = Math.max(50, Math.min(92, scoreBase));

  // Generate deterministic variations using a hash so the same resume ALWAYS gets the exact same score
  const hashString = `${candidateMeta.name || ''}-${resumeText || ''}-${JSON.stringify(jobRequirements || {})}`;
  const hashHex = crypto.createHash('sha256').update(hashString).digest('hex');
  
  // Extract 3 pseudo-random values between 0 and 1 from the hash
  const prng1 = parseInt(hashHex.substring(0, 4), 16) / 0xFFFF;
  const prng2 = parseInt(hashHex.substring(4, 8), 16) / 0xFFFF;
  const prng3 = parseInt(hashHex.substring(8, 12), 16) / 0xFFFF;
  
  return {
    matcher: {
      skillMatchScore: Math.min(100, Math.round(scoreBase + (prng1 * 8))),
      experienceScore: Math.min(100, Math.round(scoreBase + (prng2 * 10) - 2)),
      skillsMatched: matchedSkills.length > 0 ? matchedSkills : ['JavaScript', 'React'],
      skillsMissing: missingSkills.length > 0 ? missingSkills : ['Docker', 'AWS']
    },
    culture: {
      overallCultureFit: Math.min(100, Math.round(scoreBase + (prng3 * 12)))
    },
    flags: {
      riskScore: Math.max(0, Math.round(scoreBase - 5)),
      flags: []
    }
  };
};

module.exports = {
  runMockEvaluation
};
