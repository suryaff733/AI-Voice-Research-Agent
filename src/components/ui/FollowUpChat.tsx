'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, RefreshCw, Presentation, FileDown } from 'lucide-react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface FollowUpChatProps {
  initialRelated?: string[];
  reportContext?: any;
}

export default function FollowUpChat({ initialRelated = [], reportContext }: FollowUpChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'You can ask follow-up questions to drill deeper, explain calculations, view raw sources, or export this report.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExport = async (format: 'pdf' | 'presentation') => {
    if (!reportContext) return;
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ report: reportContext, format }),
      });

      if (!response.ok) throw new Error('Export trigger failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai_voice_research_agent_${format}.${format === 'presentation' ? 'pptx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error('Failed to download export from chat companion:', err);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response based on follow-up keywords
    setTimeout(() => {
      const query = text.toLowerCase();
      let response = '';

      if (query.includes('pdf') || query.includes('export')) {
        response = 'Sure! I have generated your research export. You can trigger the export using the action buttons at the top right of the dashboard.';
      } else if (query.includes('presentation') || query.includes('slides')) {
        response = 'I have prepared a presentation draft based on the consensus data. You can download the PowerPoint/slides format using the export palette.';
      } else if (query.includes('why') || query.includes('explain') || query.includes('contradiction')) {
        response = 'Statista projects high numbers (85M) based on supply chain orders, whereas Canalys records channel sales (78.5M). The variance occurs because of inventory warehousing and distribution times in global retail networks.';
      } else if (query.includes('source') || query.includes('where')) {
        response = 'This data was synthesized from three primary nodes: Statista (Global Unit Sales Forecast), Canalys (TWS Shipments), and Bloomberg (Wearables Business Analysis). You can view details in the "Sources" card on the right.';
      } else {
        response = `That's an interesting angle regarding "${text}". Based on the scraping records, Apple manages to keep its average selling price above $179, resulting in higher gross profit margins than competitors.`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="rounded-2xl border border-zinc-850 bg-zinc-950/40 p-6 backdrop-blur-xl flex flex-col h-[480px]">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-900 shrink-0">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
          <h3 className="text-sm font-semibold text-white tracking-tight">AI Research Companion</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleExport('presentation')}
            className="text-[10px] font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 hover:text-white px-2 py-1 rounded flex items-center gap-1.5 transition-all"
          >
            <Presentation className="h-3 w-3" /> Slides
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="text-[10px] font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 hover:text-white px-2 py-1 rounded flex items-center gap-1.5 transition-all"
          >
            <FileDown className="h-3 w-3" /> PDF
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 text-xs leading-relaxed ${
              m.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`h-7 w-7 rounded-lg flex items-center justify-center border shrink-0 ${
              m.sender === 'user'
                ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
                : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
            }`}>
              {m.sender === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            </div>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 border font-medium ${
              m.sender === 'user'
                ? 'bg-zinc-900/80 border-zinc-800 text-white rounded-tr-none'
                : 'bg-zinc-950/60 border-zinc-900 text-zinc-300 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-3 text-xs">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center border bg-indigo-500/10 border-indigo-500/20 text-indigo-400 shrink-0">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            </div>
            <div className="rounded-2xl px-4 py-2.5 bg-zinc-950/60 border border-zinc-900 text-zinc-500 rounded-tl-none flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-650 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-650 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-650 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested chips */}
      {initialRelated.length > 0 && messages.length === 1 && (
        <div className="pb-3 overflow-x-auto whitespace-nowrap space-x-2 shrink-0 no-scrollbar">
          {initialRelated.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="inline-block text-[10px] font-bold text-zinc-400 bg-zinc-900/60 border border-zinc-850 hover:bg-zinc-900 hover:text-white px-2.5 py-1.5 rounded-full transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input panel */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex items-center space-x-2 shrink-0 border-t border-zinc-900 pt-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask follow-up question..."
          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 backdrop-blur-md font-medium"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 transition-all shadow-[0_0_10px_rgba(99,102,241,0.3)] shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
