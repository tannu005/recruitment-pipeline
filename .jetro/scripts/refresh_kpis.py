import json
import sqlite3
import os

workspace = os.environ.get('JET_WORKSPACE', '.')
db_path = os.path.join(workspace, 'backend', 'data', 'recruitment.db')

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute('SELECT COUNT(*) FROM candidates')
total = cursor.fetchone()[0]

cursor.execute('SELECT AVG(overall_score) FROM evaluations')
avg_score = round(cursor.fetchone()[0] or 0, 1)

cursor.execute("SELECT COUNT(*) FROM evaluations WHERE status = 'Strong Match'")
strong = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM evaluations WHERE overall_score >= 60")
passing = cursor.fetchone()[0]

conn.close()

result = {
    'totalCandidates': total,
    'avgScore': avg_score,
    'strongMatches': strong,
    'conversionRate': round((passing / total) * 100, 1) if total > 0 else 0,
    'lastRefreshed': __import__('datetime').datetime.now().isoformat()
}

print(json.dumps(result))
