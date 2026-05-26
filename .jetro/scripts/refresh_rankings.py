import json
import sqlite3
import os

workspace = os.environ.get('JET_WORKSPACE', '.')
db_path = os.path.join(workspace, 'backend', 'data', 'recruitment.db')

conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

cursor.execute('''
    SELECT c.name, c.email, e.overall_score, e.status, e.recommendation,
           e.scores, e.strengths, e.gaps, e.rank
    FROM candidates c
    JOIN evaluations e ON c.id = e.candidate_id
    ORDER BY e.overall_score DESC
''')

candidates = []
for row in cursor.fetchall():
    scores = json.loads(row['scores']) if row['scores'] else {}
    candidates.append({
        'name': row['name'],
        'email': row['email'],
        'overallScore': row['overall_score'],
        'status': row['status'],
        'recommendation': row['recommendation'],
        'skillMatch': scores.get('skillMatch', 0),
        'cultureFit': scores.get('cultureFit', 0),
        'rank': row['rank']
    })

conn.close()

result = {
    'candidates': candidates,
    'lastRefreshed': __import__('datetime').datetime.now().isoformat()
}

print(json.dumps(result))
