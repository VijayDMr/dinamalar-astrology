// src/components/FeedbackWidget.tsx

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useFeedback } from '../hooks/useFeedback';

interface FeedbackWidgetProps {
  rasiId: string;
  predictionType: string;
}

/**
 * Enterprise Reusable Sentiment and Quality Feedback Widget.
 * Allows users to upvote/downvote and comment on predictions, connecting directly to the API routes.
 */
export default function FeedbackWidget({ rasiId, predictionType }: FeedbackWidgetProps) {
  const { submitting, success, error, submitFeedback, resetFeedbackState } = useFeedback();
  const [selectedSentiment, setSelectedSentiment] = useState<'upvote' | 'downvote' | null>(null);
  const [comment, setComment] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleSentimentClick = async (sentiment: 'upvote' | 'downvote') => {
    setSelectedSentiment(sentiment);
    setShowForm(true);
    resetFeedbackState();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSentiment) return;

    const payload = {
      sentiment: selectedSentiment,
      rasiId,
      predictionType,
      comment: comment.trim() || undefined
    };

    const isOk = await submitFeedback(payload);
    if (isOk) {
      setComment('');
      // Hide form after 3 seconds upon success
      setTimeout(() => {
        setShowForm(false);
        setSelectedSentiment(null);
        resetFeedbackState();
      }, 3500);
    }
  };

  return (
    <div className="w-full bg-black/35 backdrop-blur-md rounded-2xl border border-red-900/15 p-3.5 mt-4 transition-all duration-300 hover:border-red-900/30">
      
      {/* 1. INITIAL RATINGS ROW */}
      {!showForm && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] sm:text-xs text-slate-400 font-semibold font-sans flex items-center gap-1.5 leading-none">
            <InfoIcon /> இந்த ஜோதிட கணிப்பு உங்களுக்கு பயனுள்ளதாக இருந்ததா?
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSentimentClick('upvote')}
              className="px-3.5 py-1.5 rounded-xl border border-slate-900 hover:border-emerald-500/50 hover:bg-emerald-950/25 text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 text-xs font-bold transition-all duration-300 shadow-sm"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>பயனுள்ளது</span>
            </button>
            <button
              onClick={() => handleSentimentClick('downvote')}
              className="px-3.5 py-1.5 rounded-xl border border-slate-900 hover:border-rose-500/50 hover:bg-rose-950/25 text-slate-400 hover:text-rose-400 flex items-center gap-1.5 text-xs font-bold transition-all duration-300 shadow-sm"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>திருப்தியில்லை</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. FEEDBACK SUBMISSION FORM OVERLAY */}
      {showForm && (
        <AnimateHeight>
          <form onSubmit={handleFormSubmit} className="space-y-3 relative">
            <div className="flex items-center justify-between border-b border-red-950/10 pb-2 mb-2">
              <span className="text-[11.5px] font-bold text-yellow-500 flex items-center gap-1.5">
                {selectedSentiment === 'upvote' ? (
                  <ThumbsUp className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ThumbsDown className="w-4 h-4 text-rose-400" />
                )}
                {selectedSentiment === 'upvote' ? 'மகிழ்ச்சி! உங்கள் பரிந்துரை:' : 'மன்னிக்கவும், உங்கள் கருத்து:'}
              </span>
              <button
                type="button"
                onClick={() => { setShowForm(false); setSelectedSentiment(null); }}
                className="text-xs text-slate-500 hover:text-slate-300 font-semibold hover:underline px-1.5 py-0.5 rounded"
              >
                மூடுக (Close)
              </button>
            </div>

            {/* Display message status */}
            {success ? (
              <div className="bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-xl flex items-center gap-2.5 text-xs text-emerald-400 animate-pulse">
                <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
                <span className="font-semibold leading-relaxed">{success}</span>
              </div>
            ) : error ? (
              <div className="bg-rose-950/20 border border-rose-900/30 p-3 rounded-xl flex items-center gap-2.5 text-xs text-rose-400">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            ) : (
              <div className="flex items-stretch gap-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="உங்களது திருத்தங்கள் அல்லது கருத்துக்களை இங்கு எழுதவும் (விருப்பம்)..."
                  maxLength={150}
                  className="flex-1 bg-black/45 border border-slate-900 focus:border-yellow-500/50 outline-none rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 transition-all font-sans"
                  disabled={submitting}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 bg-gradient-to-r from-red-900 to-red-950 hover:from-red-800 hover:to-red-900 border border-yellow-500/20 hover:border-yellow-500/40 text-yellow-400 hover:text-yellow-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>அனுப்புக</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </AnimateHeight>
      )}

    </div>
  );
}

// Simple Helper Components to keep code clean and self-contained
function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-500 fill-none stroke-current" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function AnimateHeight({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in transition-all duration-300 overflow-hidden">
      {children}
    </div>
  );
}
