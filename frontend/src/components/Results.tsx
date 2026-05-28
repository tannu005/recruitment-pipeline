import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, HelpCircle, ArrowRight, Play, ShieldAlert, Award, FileText, Sparkles, Scale, Search, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CandidateDetails from './CandidateDetails';
import CandidateCompare from './CandidateCompare';

const PIPELINE_STAGES = ['New', 'Screened', 'Interview', 'Offer', 'Hired', 'Rejected'];

function Results({ token, apiUrl, jobId, job, candidates, evaluations, setTab, refreshData, isBlindMode }: any) {
  const [expandedId, setExpandedId] = useState(null);
  const [evalLoading, setEvalLoading] = useState({});
  const [compareIds, setCompareIds] = useState([]);
  const [isComparing, setIsComparing] = useState(false);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, string>>({});

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMinScore, setFilterMinScore] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  const pendingCandidates = candidates.filter(c => c.status === 'pending_evaluation');
  const evaluatedCandidates = evaluations?.candidates || [];

  // Apply filters
  const filteredCandidates = evaluatedCandidates.filter((cand) => {
    const score = cand.scores?.overallScore || cand.overallScore || 0;
    const name = (cand.name || '').toLowerCase();
    const strengths = (cand.strengths || []).join(' ').toLowerCase();

    // Search
    if (searchQuery && !name.includes(searchQuery.toLowerCase()) && !strengths.includes(searchQuery.toLowerCase())) return false;
    // Status filter
    if (filterStatus !== 'all' && cand.status !== filterStatus) return false;
    // Min score
    if (score < filterMinScore) return false;

    return true;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleToggleCompare = (id) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter(i => i !== id));
    } else {
      if (compareIds.length >= 3) {
        toast.error('You can compare up to 3 candidates at a time.');
        return;
      }
      setCompareIds([...compareIds, id]);
    }
  };

  const handleStatusChange = (candidateId: string, newStatus: string) => {
    setStatusOverrides(prev => ({ ...prev, [candidateId]: newStatus }));
    toast.success(`Pipeline stage → ${newStatus}`);
  };

  const handleBulkAction = (action: string) => {
    const newOverrides = { ...statusOverrides };
    compareIds.forEach(id => { newOverrides[id] = action; });
    setStatusOverrides(newOverrides);
    toast.success(`${compareIds.length} candidates → ${action}`);
    setCompareIds([]);
  };

  const handleEvaluate = async (candidateId) => {
    setEvalLoading(prev => ({ ...prev, [candidateId]: true }));

    try {
      const res = await fetch(`${apiUrl}/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId,
          candidateIds: [candidateId]
        })
      });

      if (!res.ok) {
        throw new Error('Evaluation request failed.');
      }

      refreshData();
      toast.success('Evaluation completed successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setEvalLoading(prev => ({ ...prev, [candidateId]: false }));
    }
  };

  const handleEvaluateAll = async () => {
    if (pendingCandidates.length === 0) return;
    
    const loadings = {};
    pendingCandidates.forEach(c => { loadings[c.id] = true; });
    setEvalLoading(prev => ({ ...prev, ...loadings }));

    try {
      const res = await fetch(`${apiUrl}/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId,
          candidateIds: pendingCandidates.map(c => c.id)
        })
      });

      if (!res.ok) {
        throw new Error('Batch evaluation request failed.');
      }

      refreshData();
      toast.success('Batch evaluation completed!');
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      const clears = {};
      pendingCandidates.forEach(c => { clears[c.id] = false; });
      setEvalLoading(prev => ({ ...prev, ...clears }));
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 75) return 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20';
    if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'New': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'Screened': return 'text-teal-400 bg-teal-500/10 border-teal-500/30';
      case 'Interview': return 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30';
      case 'Offer': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Hired': return 'text-green-300 bg-green-500/15 border-green-500/30';
      case 'Rejected': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getFlagColor = (severity) => {
    if (severity === 'high') return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
    if (severity === 'medium') return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
    return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
  };

  if (isComparing) {
    const candidatesToCompare = evaluatedCandidates.filter(c => compareIds.includes(c.candidateId));
    return <CandidateCompare candidates={candidatesToCompare} onBack={() => setIsComparing(false)} isBlindMode={isBlindMode} />;
  }

  return (
    <div className="space-y-8 relative">
      {/* Bottom Action Bar — Bulk Actions */}
      {compareIds.length >= 1 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#1A1025]/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(217,70,239,0.3)] border border-fuchsia-500/30 text-white px-6 py-3 rounded-full flex items-center gap-3 z-50">
          <span className="font-bold text-sm text-fuchsia-300">{compareIds.length} Selected</span>
          <div className="w-px h-5 bg-white/10" />
          <button 
            onClick={() => handleBulkAction('Screened')}
            className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-semibold py-1.5 px-4 rounded-full text-xs transition-colors border border-teal-500/30"
          >
            Bulk Shortlist
          </button>
          <button 
            onClick={() => handleBulkAction('Rejected')}
            className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold py-1.5 px-4 rounded-full text-xs transition-colors border border-rose-500/30"
          >
            Bulk Reject
          </button>
          {compareIds.length > 1 && (
            <>
              <div className="w-px h-5 bg-white/10" />
              <button 
                onClick={() => setIsComparing(true)}
                className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold py-1.5 px-4 rounded-full text-xs transition-colors flex items-center gap-2"
              >
                <Scale className="h-3 w-3" /> Compare
              </button>
            </>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans flex items-center gap-2">
            Candidate Evaluations <Award className="h-6 w-6 text-fuchsia-400" />
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Ratings for <strong className="text-fuchsia-400">{job?.title || 'Active Job'}</strong> based on multi-agent analysis.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {setTab && (
            <button 
              onClick={() => setTab('dashboard')}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-fuchsia-400 transition-colors bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-2xl"
            >
              ← Back to Dashboard
            </button>
          )}

        {pendingCandidates.length > 0 && (
          <button
            onClick={handleEvaluateAll}
            className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-orange-600 hover:from-fuchsia-600 hover:to-orange-700 text-white font-semibold py-2.5 px-5 rounded-3xl text-sm transition-all shadow-[0_4px_20px_rgba(99,102,241,0.2)]"
          >
            <Play className="h-4 w-4 fill-white" /> Evaluate Pending ({pendingCandidates.length})
          </button>
        )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      {evaluatedCandidates.length > 0 && (
        <div className="glass-panel rounded-3xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-[#1a1a1a] border border-gray-700 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-gray-500 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or skill..."
              className="bg-transparent border-none outline-none flex-1 text-white text-sm placeholder-gray-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-fuchsia-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Strong Match">Strong Match</option>
            <option value="Good Match">Good Match</option>
            <option value="Potential Match">Potential Match</option>
            <option value="Poor Match">Poor Match</option>
          </select>
          <select
            value={filterMinScore}
            onChange={(e) => setFilterMinScore(Number(e.target.value))}
            className="bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-fuchsia-500 cursor-pointer"
          >
            <option value={0}>Any Score</option>
            <option value={80}>80%+</option>
            <option value={60}>60%+</option>
            <option value={40}>40%+</option>
          </select>
          {(searchQuery || filterStatus !== 'all' || filterMinScore > 0) && (
            <button
              onClick={() => { setSearchQuery(''); setFilterStatus('all'); setFilterMinScore(0); }}
              className="text-xs text-fuchsia-400 hover:text-fuchsia-300 font-bold shrink-0"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Grid of Results */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Pending Candidates Section */}
        {pendingCandidates.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-1">Pending Evaluations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingCandidates.map((cand, index) => (
                <div key={cand.id} className="glass-panel p-5 rounded-3xl flex flex-col justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-white">{isBlindMode ? `Candidate #${(index + 1).toString().padStart(3, '0')}` : cand.name}</h4>
                    {!isBlindMode && <p className="text-xs text-gray-500 font-mono">{cand.email}</p>}
                    <p className="text-[10px] text-fuchsia-400 mt-1">Uploaded {new Date(cand.uploaded_at).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => handleEvaluate(cand.id)}
                    disabled={evalLoading[cand.id]}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-gray-800 border border-slate-800 text-fuchsia-400 font-semibold py-2 px-4 rounded-3xl text-xs transition-all disabled:opacity-50"
                  >
                    {evalLoading[cand.id] ? (
                      <div className="w-4 h-4 border-2 border-fuchsia-400/30 border-t-fuchsia-400 rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3" /> Run Evaluation
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evaluated Candidates Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Ranked Results</h3>
              <div className="flex bg-[#1a1a1a] rounded-lg p-0.5 border border-gray-800">
                <button
                  onClick={() => setViewMode('list')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer ${
                    viewMode === 'list' ? 'bg-fuchsia-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer ${
                    viewMode === 'kanban' ? 'bg-fuchsia-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Kanban
                </button>
              </div>
            </div>
            {filteredCandidates.length !== evaluatedCandidates.length && (
              <span className="text-xs text-fuchsia-400 font-medium">
                Showing {filteredCandidates.length} of {evaluatedCandidates.length}
              </span>
            )}
          </div>
          {filteredCandidates.length === 0 ? (
            <div className="glass-panel p-10 rounded-3xl text-center text-gray-500 text-sm">
              <FileText className="h-8 w-8 mx-auto text-gray-600 mb-3" />
              {evaluatedCandidates.length === 0
                ? 'No candidates have been evaluated yet. Click "Run Evaluation" on pending candidates above.'
                : 'No candidates match your current filters.'}
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-4">
              {filteredCandidates.map((cand, index) => {
                const isExpanded = expandedId === cand.candidateId;
                const score = cand.scores?.overallScore || cand.overallScore || 0;
                const pipelineStage = statusOverrides[cand.candidateId] || 'New';
                
                return (
                  <div
                    key={cand.candidateId}
                    className={`glass-panel rounded-3xl overflow-hidden transition-all duration-300 border ${
                      isExpanded ? 'border-fuchsia-500/40 shadow-[0_4px_20px_rgba(99,102,241,0.2)]' : 'border-slate-800 hover:border-slate-700/60'
                    }`}
                  >
                    {/* Collapsed Header */}
                    <div
                      onClick={() => toggleExpand(cand.candidateId)}
                      className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer select-none bg-[#1a1a1a]/10"
                    >
                      <div className="flex items-center gap-4">
                        {/* Checkbox for Compare/Bulk */}
                        <div 
                          className="mr-2 flex items-center justify-center cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); handleToggleCompare(cand.candidateId); }}
                        >
                          <div className={`w-5 h-5 rounded border ${compareIds.includes(cand.candidateId) ? 'bg-fuchsia-500 border-fuchsia-500 text-white' : 'border-gray-600 bg-transparent'} flex items-center justify-center transition-colors`}>
                            {compareIds.includes(cand.candidateId) && <CheckCircle className="w-3 h-3" />}
                          </div>
                        </div>

                        {/* Rank Badge */}
                        <div className="w-8 h-8 rounded-full bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 flex items-center justify-center font-mono font-extrabold text-sm">
                          #{cand.rank}
                        </div>
                        
                        <div>
                          <h3 className="font-bold text-white text-base flex items-center gap-2">
                            {isBlindMode ? `Candidate #${(index + 1).toString().padStart(3, '0')}` : cand.name}
                          </h3>
                          {!isBlindMode && <p className="text-xs text-gray-500 font-mono mt-0.5">{cand.email}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        {/* Pipeline Stage Dropdown */}
                        <select
                          value={pipelineStage}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => { e.stopPropagation(); handleStatusChange(cand.candidateId, e.target.value); }}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none focus:border-fuchsia-500 ${getStageColor(pipelineStage)}`}
                        >
                          {PIPELINE_STAGES.map(s => (
                            <option key={s} value={s} className="bg-[#1a1a1a] text-white">{s}</option>
                          ))}
                        </select>

                        {/* AI Status badge */}
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getScoreColor(score)}`}>
                          {cand.status}
                        </span>

                        {/* Overall score */}
                        <div className="text-right">
                          <span className="text-2xl font-extrabold text-white block">{score}%</span>
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-semibold">Match Score</span>
                        </div>

                        <div>
                          {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content Panel */}
                    {isExpanded && (
                      <CandidateDetails cand={cand} token={token} apiUrl={apiUrl} isBlindMode={isBlindMode} />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
              {PIPELINE_STAGES.map(stage => {
                const stageCandidates = filteredCandidates.filter(c => (statusOverrides[c.candidateId] || 'New') === stage);
                
                return (
                  <div key={stage} className="bg-[#120a1a]/40 border border-gray-800/40 rounded-2xl p-4 flex flex-col min-w-[190px] max-h-[600px] glass-panel transition-all">
                    <div className="flex items-center justify-between border-b border-gray-800/60 pb-2 mb-3">
                      <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{stage}</span>
                      <span className="text-[10px] bg-slate-800 text-gray-400 px-2 py-0.5 rounded-full font-bold">{stageCandidates.length}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[150px]">
                      {stageCandidates.length === 0 ? (
                        <div className="text-center py-10 text-[11px] text-gray-600 italic">No candidates</div>
                      ) : (
                        stageCandidates.map((cand, idx) => {
                          const score = cand.scores?.overallScore || cand.overallScore || 0;
                          return (
                            <div 
                              key={cand.candidateId} 
                              onClick={() => toggleExpand(cand.candidateId)}
                              className="bg-[#1a1a1a]/60 hover:bg-[#1a1a1a]/95 border border-gray-850 hover:border-fuchsia-500/40 rounded-xl p-3 cursor-pointer transition-all space-y-2 shadow-md"
                            >
                              <div className="flex justify-between items-start gap-1">
                                <span className="text-xs font-bold text-white leading-tight break-words">
                                  {isBlindMode ? `Cand. #${(idx + 1).toString().padStart(3, '0')}` : cand.name}
                                </span>
                                <span className={`text-[10px] font-extrabold shrink-0 ${score >= 85 ? 'text-emerald-400' : score >= 70 ? 'text-teal-400' : 'text-amber-400'}`}>{score}%</span>
                              </div>
                              
                              <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-gray-800/20">
                                <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${getScoreColor(score)}`}>{cand.status.split(' ')[0]}</span>
                                <select
                                  value={stage}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => { e.stopPropagation(); handleStatusChange(cand.candidateId, e.target.value); }}
                                  className="text-[9px] bg-[#222222] border border-gray-800 rounded px-1 py-0.5 text-gray-300 focus:outline-none cursor-pointer"
                                >
                                  {PIPELINE_STAGES.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Results;
