const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'recruitment.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.all(`
    SELECT 
      c.id as candidate_id,
      c.name as candidate_name,
      c.email as candidate_email,
      c.status as candidate_status,
      e.overall_score,
      e.status as evaluation_status,
      e.recommendation,
      e.strengths,
      e.gaps,
      e.red_flags,
      e.suggested_questions,
      e.scores
    FROM candidates c
    LEFT JOIN evaluations e ON c.id = e.candidate_id
  `, (err, rows) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(JSON.stringify(rows, null, 2));
  });
});
