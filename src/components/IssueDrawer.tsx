import { useState, useEffect } from 'react';
import type { Issue } from '../types';

interface IssueDrawerProps {
  issue: Issue;
  onClose: () => void;
  onDeploy: (id: string, fix: string) => void;
}

export function IssueDrawer({ issue, onClose, onDeploy }: IssueDrawerProps) {
  const [editedFix, setEditedFix] = useState(issue.suggestedPromptDiff);
  const [deployed, setDeployed] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function handleDeploy() {
    setDeployed(true);
    setTimeout(() => {
      onDeploy(issue.id, editedFix);
      onClose();
    }, 1200);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs text-gray-400">{issue.category}</span>
              <span className="text-gray-200">·</span>
              <span className="text-xs text-gray-400">{issue.evaluator}</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{issue.title}</h2>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{issue.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 mt-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-7">

          {/* Sample spans */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">
                Affected spans
              </h3>
              <span className="text-xs text-gray-400">
                {issue.affectedSpans.toLocaleString()} total · showing {issue.sampleSpans.length}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {issue.sampleSpans.map(span => (
                <div
                  key={span.id}
                  className={`rounded-lg border p-4 ${
                    span.evalLabel === 'fail'
                      ? 'border-red-100 bg-red-50/40'
                      : 'border-emerald-100 bg-emerald-50/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                      span.evalLabel === 'fail' ? 'bg-red-100' : 'bg-emerald-100'
                    }`}>
                      {span.evalLabel === 'fail' ? (
                        <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">User</p>
                          <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{span.userInput}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Agent</p>
                          <p className="text-xs text-gray-700 leading-relaxed">{span.agentOutput}</p>
                        </div>
                      </div>
                      <p className={`text-xs mt-1 ${span.evalLabel === 'fail' ? 'text-red-600' : 'text-emerald-700'}`}>
                        <span className="font-medium">{span.evalLabel === 'fail' ? 'Why it failed: ' : 'Why it passed: '}</span>
                        {span.evalReason}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Suggested fix */}
          <section>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Suggested prompt change</h3>
            <p className="text-xs text-gray-400 mb-3">
              Arize identified this instruction as the most likely fix. Edit if needed, then deploy.
            </p>
            <textarea
              value={editedFix}
              onChange={e => setEditedFix(e.target.value)}
              rows={6}
              className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-3 text-gray-800 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none bg-gray-50"
            />
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeploy}
            disabled={deployed}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
              deployed
                ? 'bg-emerald-500 text-white'
                : 'bg-violet-600 hover:bg-violet-700 text-white'
            }`}
          >
            {deployed ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Deploying...
              </>
            ) : (
              <>
                Deploy Fix
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
