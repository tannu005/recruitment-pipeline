import React, { useState } from 'react';
import { Star, Search, UserCheck, Briefcase, Award, Filter } from 'lucide-react';

function TalentPool({ setTab, isBlindMode, evaluations, jobs }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Build real talent pool from ALL evaluated candidates across jobs
  const allEvaluated = evaluations?.candidates || [];
  
  // Silver medalists: candidates with overall score >= 70
  const silverMedalists = allEvaluated
    .filter((cand: any) => {
      const score = cand.scores?.overallScore || cand.overallScore || 0;
      return score >= 70;
    })
    .sort((a: any, b: any) => {
      const scoreA = a.scores?.overallScore || a.overallScore || 0;
      const scoreB = b.scores?.overallScore || b.overallScore || 0;
      return scoreB - scoreA;
    });
  
  // Apply search
  const filtered = silverMedalists.filter((cand: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const name = (cand.name || '').toLowerCase();
    const strengths = (cand.strengths || []).join(' ').toLowerCase();
    return name.includes(q) || strengths.includes(q);
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans flex items-center gap-2">
            Global Talent Pool <Star className="h-6 w-6 text-fuchsia-400 fill-fuchsia-400" />
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            High-scoring candidates (70%+) saved as "Silver Medalists" for future opportunities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 px-3 py-1 rounded-full font-bold">
            {filtered.length} Candidates
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="glass-panel p-4 rounded-3xl flex items-center gap-4">
        <div className="flex-1 flex items-center gap-3 bg-[#1a1a1a]/50 border border-gray-800 rounded-full px-4 py-2 text-gray-400">
          <Search className="w-5 h-5" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or skill..." 
            className="bg-transparent border-none outline-none flex-1 text-white text-sm"
          />
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
          <Award className="h-12 w-12 text-gray-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Silver Medalists Yet</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            {allEvaluated.length === 0 
              ? "Evaluate candidates first — those scoring 70%+ will automatically appear here as your talent pool."
              : searchQuery 
                ? "No candidates match your search. Try different keywords."
                : "No candidates scored above 70% in your current evaluations."
            }
          </p>
          {allEvaluated.length === 0 && (
            <button 
              onClick={() => setTab('upload')}
              className="bg-gradient-to-r from-fuchsia-500 to-orange-600 hover:from-fuchsia-600 hover:to-orange-700 text-white font-semibold py-2.5 px-6 rounded-3xl text-sm transition-all"
            >
              Upload Candidates
            </button>
          )}
        </div>
      ) : (
        /* Talent Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cand: any, idx: number) => {
            const score = cand.scores?.overallScore || cand.overallScore || 0;
            const topStrength = cand.strengths?.[0] || 'Strong overall candidate';
            
            return (
              <div key={cand.candidateId || idx} className="glass-panel p-6 rounded-3xl border border-slate-800/60 hover:border-fuchsia-500/40 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-fuchsia-500/20">
                    {isBlindMode ? `C${idx+1}` : (cand.name || 'U').charAt(0)}
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <UserCheck className="w-3 h-3" /> {score}% Match
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">
                  {isBlindMode ? `Candidate #${(idx + 1).toString().padStart(3, '0')}` : cand.name}
                </h3>
                <p className="text-fuchsia-400 text-sm font-semibold mb-2">{cand.status}</p>
                
                <div className="space-y-2 pt-4 border-t border-gray-800/50">
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Top Strength:
                  </p>
                  <p className="text-sm text-gray-300 font-medium leading-snug">{topStrength}</p>
                </div>

                {cand.gaps?.[0] && (
                  <div className="mt-3 pt-3 border-t border-gray-800/50">
                    <p className="text-xs text-gray-500 mb-1">Key Gap:</p>
                    <p className="text-xs text-amber-400/80">{cand.gaps[0]}</p>
                  </div>
                )}

                <button 
                  onClick={() => setTab('results')}
                  className="w-full mt-6 bg-[#1a1a1a] hover:bg-fuchsia-500 text-white border border-gray-800 hover:border-fuchsia-400 py-2.5 rounded-xl text-sm font-semibold transition-all"
                >
                  Review Profile
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TalentPool;
