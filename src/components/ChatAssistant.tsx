// src/components/ChatAssistant.tsx

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, User, Brain, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ChatMessage } from '../types/astrology';

/**
 * Premium RAG-powered Gemini AI Astrology Chat Assistant.
 * Floating dock widget connecting securely to your AI API.
 */
export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { activeBirthDetails, geminiApiKey } = useAppStore();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `வணக்கம்! நான் உங்கள் நவகிரக ஜோதிட உதவியாளர் (Gemini AI Astrologer). உங்களது பிறந்த ஜாதகத்தின் துல்லியமான கிரக நிலைகள் எனக்குத் தெரியும். 

உதாரணமாக என்னிடம் கேட்கலாம்:
• "எனது உத்தியோக பலன் எப்படி இருக்கும்?" (Career)
• "எனக்கு எந்த ரத்தினக் கல் யோகம் தரும்?" (Gemstone)
• "திருமண வாழ்க்கை எப்போது அமையும்?" (Marriage)
      `,
      timestamp: new Date().toISOString()
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSuggestionClick = (question: string) => {
    setInput(question);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || submitting) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSubmitting(true);
    setError(null);

    const startTime = Date.now();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(geminiApiKey ? { 'x-gemini-key': geminiApiKey } : {})
        },
        body: JSON.stringify({
          question: userMessage.content,
          birthDetails: activeBirthDetails,
          chatHistory: messages.slice(-5) // Send last 5 dialogue turns for memory context
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'AI Response failed.');
      }

      const assistantMessage: ChatMessage = {
        id: Math.random().toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        metadata: {
          latencyMs: data.metadata?.latencyMs || (Date.now() - startTime),
          source: data.metadata?.source,
          isFallback: data.metadata?.isFallback
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (err: any) {
      setError(err.message || 'உரையாடலில் பிழை ஏற்பட்டது.');
      // Auto fallback message in UI
      const errMessage: ChatMessage = {
        id: Math.random().toString(),
        role: 'assistant',
        content: 'மன்னிக்கவும்! பிணைய இணைப்புத் தோல்வி காரணமாக என்னால் பதிலளிக்க முடியவில்லை. தயவுசெய்து உங்கள் இணைய இணைப்பைச் சரிபார்க்கவும் அல்லது சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errMessage]);
    } finally {
      setSubmitting(false);
    }
  };

  const suggestionChips = [
    "எனது வேலை எப்போது கிடைக்கும்?",
    "என் திருமண யோகம் எப்படி உள்ளது?",
    "நிதி நிலை முன்னேற வழிகள்?",
    "நான் அணிய வேண்டிய ராசி கல்?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans select-none">
      
      {/* 1. COLLAPSED FLOATING CHAT BUBBLE BUTTON */}
      {!isOpen && (
        <motion.button
          layoutId="chat-widget"
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-red-800 to-red-950 border border-yellow-400 flex items-center justify-center text-yellow-400 shadow-[0_4px_25px_rgba(234,179,8,0.4)] hover:shadow-[0_4px_30px_rgba(234,179,8,0.6)] hover:scale-115 active:scale-95 transition-all duration-300 relative group"
        >
          {/* Pulsing stardust outline */}
          <span className="absolute inset-0 rounded-full border border-yellow-400 animate-ping opacity-25" />
          <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 border border-black text-[9px] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
            AI Active
          </span>
        </motion.button>
      )}

      {/* 2. CHAT CONSOLE EXPANDED OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId="chat-widget"
            className="w-full sm:w-[380px] h-[500px] bg-gradient-to-b from-slate-900 to-slate-950 border-gold-traditional rounded-3xl overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.95)] flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-3.5 border-b border-red-900/35 bg-gradient-to-r from-red-950/50 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                  <Brain className="w-4.5 h-4.5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gold-gradient tracking-wide leading-none">
                    ஜெமினி AI ஜோதிடர் (AI Astrologer)
                  </h4>
                  <span className="text-[9px] text-slate-500 font-mono tracking-wider font-semibold uppercase leading-none block mt-1">
                    Powered by Gemini 1.5 & RAG
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-black/40 border border-slate-900 flex items-center justify-center text-slate-400 hover:text-yellow-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Conversation History Panel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id || index}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Role Avatar */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] shrink-0 border ${
                      isUser 
                        ? 'bg-slate-800 border-slate-700 text-slate-100' 
                        : 'bg-red-950 border-yellow-500/25 text-yellow-500'
                    }`}>
                      {isUser ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                    </div>

                    {/* Dialogue Balloon bubble */}
                    <div className="flex flex-col max-w-[78%]">
                      <div className={`p-3 rounded-2xl text-[12.5px] leading-relaxed shadow-sm whitespace-pre-line text-justify font-sans ${
                        isUser 
                          ? 'bg-red-950/70 border border-yellow-500/10 text-slate-100 rounded-tr-none' 
                          : 'bg-slate-900/60 border border-slate-900 text-slate-200 rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                      
                      {/* Telemetry metadata footer */}
                      {msg.metadata && !isUser && (
                        <span className="text-[8px] text-slate-600 font-mono mt-1 text-right font-semibold uppercase tracking-wider block">
                          Source: {msg.metadata.source?.replace('_', ' ')} ({msg.metadata.latencyMs}ms)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Submitting typing indicator skeleton */}
              {submitting && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-red-950 border border-yellow-500/25 text-yellow-500 flex items-center justify-center shrink-0 animate-spin">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-900/40 border border-slate-900 p-3 rounded-2xl rounded-tl-none max-w-[70%] flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* suggestion chips */}
            {messages.length < 3 && !submitting && (
              <div className="px-4 py-2 border-t border-slate-900/40 flex flex-wrap gap-1.5 justify-center">
                {suggestionChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSuggestionClick(chip)}
                    className="px-2.5 py-1 bg-black/40 border border-red-950/20 hover:border-yellow-500/35 text-slate-400 hover:text-yellow-400 rounded-lg text-[10px] font-bold tracking-wide transition-all shadow-sm whitespace-nowrap leading-none"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Input row footer */}
            <form 
              onSubmit={handleSend}
              className="p-3 border-t border-slate-900/40 bg-black/40 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="உங்கள் ஜாதகக் கேள்வியை இங்கு கேட்கவும்..."
                maxLength={200}
                className="flex-1 bg-black/60 border border-slate-900 focus:border-yellow-500/40 rounded-xl outline-none px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 transition-all font-sans"
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-800 to-red-950 border border-yellow-500/20 text-yellow-400 hover:text-yellow-300 flex items-center justify-center shadow-md shadow-red-950 shrink-0 hover:scale-105 transition-transform"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
