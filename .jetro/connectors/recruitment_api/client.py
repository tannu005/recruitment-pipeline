import sqlite3
import json
import os

class Client:
    def __init__(self, config, params, credential=None):
        workspace = os.environ.get('JET_WORKSPACE', '.')
        db_path = params.get('db_path', config.get('params', {}).get('db_path', {}).get('default', 'backend/data/recruitment.db'))
        self.db_path = os.path.join(workspace, db_path)
    
    def fetch(self, **kwargs):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('''
            SELECT c.id, c.name, c.email, c.status as candidate_status,
                   e.overall_score, e.status as eval_status, e.recommendation,
                   e.scores, e.strengths, e.gaps, e.rank
            FROM candidates c
            LEFT JOIN evaluations e ON c.id = e.candidate_id
            ORDER BY e.overall_score DESC
        ''')
        rows = cursor.fetchall()
        results = []
        for row in rows:
            results.append({
                'id': row['id'],
                'name': row['name'],
                'email': row['email'],
                'overall_score': row['overall_score'],
                'eval_status': row['eval_status'],
                'recommendation': row['recommendation'],
                'scores': json.loads(row['scores']) if row['scores'] else {},
                'strengths': json.loads(row['strengths']) if row['strengths'] else [],
                'gaps': json.loads(row['gaps']) if row['gaps'] else [],
                'rank': row['rank']
            })
        conn.close()
        return results
    
    def get_kpis(self, **kwargs):
        conn = sqlite3.connect(self.db_path)
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
        return {
            'totalCandidates': total,
            'avgScore': avg_score,
            'strongMatches': strong,
            'conversionRate': round((passing / total) * 100, 1) if total > 0 else 0
        }
    
    def get_pipeline(self, **kwargs):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT COUNT(*) FROM candidates')
        total = cursor.fetchone()[0]
        cursor.execute('SELECT COUNT(*) FROM evaluations')
        evaluated = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM evaluations WHERE status = 'Strong Match'")
        strong = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM evaluations WHERE status = 'Good Match'")
        good = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM evaluations WHERE status = 'Potential Match'")
        potential = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM evaluations WHERE status = 'Poor Match'")
        poor = cursor.fetchone()[0]
        conn.close()
        return [
            {'stage': 'Applied', 'count': total},
            {'stage': 'Evaluated', 'count': evaluated},
            {'stage': 'Strong Match', 'count': strong},
            {'stage': 'Good Match', 'count': good},
            {'stage': 'Potential Match', 'count': potential},
            {'stage': 'Rejected', 'count': poor}
        ]
