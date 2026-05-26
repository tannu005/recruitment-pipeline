### `evaluationService.js`
```javascript
const { dbQuery } = require('../utils/database');
const { runJetroEvaluation } = require('./jetroService');
const { parseResumeFile } = require('./fileService');
const logger = require('../utils/logger');

const evaluateCandidate = async (candidateId, jobId, evaluationConfig = {}) => {
  try {
    // 1. Fetch Candidate and Job details from database
    const candidate = await dbQuery.get('SELECT * FROM candidates WHERE id = ?', [candidateId]);
    if (!candidate) throw new Error(`Candidate with ID ${candidateId} not found.`);

    const job = await dbQuery.get('SELECT * FROM jobs WHERE id = ?', [jobId]);
    if (!job) throw new Error(`Job with ID ${jobId} not found.`);

    const jobReqs = JSON.parse(job.requirements || '{}');
    const jobValues = JSON.parse(job.company_values || '[]');
    jobReqs.companyValues = jobValues;

    // 2. Parse file to text if not already parsed
    let resumeText = candidate.resume_text;
    if (!resumeText && candidate.file_path) {
      resumeText = await parseResumeFile(candidate.file_path, '');
      // Update candidate with parsed text
      await dbQuery.run('UPDATE candidates SET resume_text = ? WHERE id = ?', [resumeText, candidateId]);
    }

    if (!resumeText) {
      throw new Error('No resume text available for evaluation.');
    }

    // 3. Trigger Jetro agents (or local simulated flow)
    const rawResult = await runJetroEvaluation(resumeText, jobReqs, {
      name: candidate.name,
      email: candidate.email
    });

    // 4. Calculate weighted score
    const weights = evaluationConfig.weights || {
      skillMatch: 0.4,
      experienceAlignment: 0.25,
      cultureFit: 0.2,
      redFlags: 0.15
    };

    const skillScore = rawResult.matcher.skillMatchScore || 0;
    const expScore = rawResult.matcher.experienceScore || 0;
    const cultureScore = rawResult.culture.overallCultureFit || 0;
    const riskScore = rawResult.flags.riskScore || 100; // riskScore is 0-100 (100 means low risk, 0 means high risk)

    

// ... (truncated for workspace view)
```