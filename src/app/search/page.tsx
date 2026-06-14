'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  Sparkles,
  ArrowLeft,
  Bookmark,
  Share2,
  FileText,
  BookmarkCheck,
  TrendingUp,
  Download,
} from 'lucide-react';
import ParticleBackground from '@/components/ui/ParticleBackground';
import RadarScan from '@/components/ui/RadarScan';
import CredibilityScore from '@/components/ui/CredibilityScore';
import DivergenceChart from '@/components/ui/DivergenceChart';
import ResearchTimeline from '@/components/ui/ResearchTimeline';
import InteractiveCharts from '@/components/ui/InteractiveCharts';
import FollowUpChat from '@/components/ui/FollowUpChat';
import { ResearchReport } from '@/lib/researchEngine';

function SearchDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(query);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Trigger search orchestration on query change
  useEffect(() => {
    if (!query) return;

    const fetchResearch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/research', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        });

        if (!res.ok) {
          throw new Error(`Failed to execute research: ${res.statusText}`);
        }

        const data = await res.json();
        setReport(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred during synthesis.');
      } finally {
        setLoading(false);
      }
    };

    fetchResearch();
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleExport = async (format: 'markdown' | 'json' | 'csv' | 'pdf' | 'presentation') => {
    if (!report) return;

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ report, format }),
      });

      if (!response.ok) throw new Error('Export trigger failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai_voice_research_agent_${format}.${format === 'presentation' ? 'pptx' : format === 'pdf' ? 'pdf' : format === 'markdown' ? 'md' : format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error('Failed to download export:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative">
        <ParticleBackground />
        <RadarScan query={query} />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative">
        <ParticleBackground />
        <div className="max-w-md text-center space-y-4 rounded-2xl border border-red-500/20 bg-red-950/15 p-8 backdrop-blur-xl">
          <p className="text-sm font-semibold text-red-400">Synthesis Failed</p>
          <p className="text-xs text-zinc-400">{error || 'Unable to retrieve research.'}</p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center text-xs font-bold text-white bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-indigo-500/30">
      <ParticleBackground />

      {/* Floating Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-900/50 bg-black/70 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Logo and Search */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/')}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 hover:text-indigo-400 transition-colors shrink-0"
            title="Go Home"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <form onSubmit={handleSearchSubmit} className="relative max-w-lg w-full md:w-80 group">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 backdrop-blur-md"
            />
          </form>
        </div>

        {/* Dashboard actions */}
        <div className="flex items-center gap-2 shrink-0 overflow-x-auto no-scrollbar">
          {/* Bookmark Button */}
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`flex items-center space-x-2 rounded-xl border px-3 py-2 text-xs font-semibold backdrop-blur-md transition-all ${
              isBookmarked
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:text-white'
            }`}
          >
            {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>

          {/* Export Dropdown / Buttons */}
          <div className="flex items-center rounded-xl bg-zinc-900/50 border border-zinc-800/80 p-0.5 backdrop-blur-md">
            <button
              onClick={() => handleExport('markdown')}
              className="text-[10px] font-bold text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-zinc-800/85 transition-all"
            >
              MD
            </button>
            <button
              onClick={() => handleExport('json')}
              className="text-[10px] font-bold text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-zinc-800/85 transition-all"
            >
              JSON
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="text-[10px] font-bold text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-zinc-800/85 transition-all"
            >
              CSV
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="text-[10px] font-bold text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-zinc-800/85 transition-all flex items-center gap-1"
            >
              <Download className="h-3 w-3" /> PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main 3-Column Layout */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left column: Timeline (lg:col-span-3) */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/20 p-6 backdrop-blur-md">
            <ResearchTimeline events={report.timeline} />
          </div>
        </aside>

        {/* Center column: Answers, Charts, Discrepancies, Chat (lg:col-span-6) */}
        <section className="lg:col-span-6 space-y-8">
          {/* Main consensus answer */}
          <article className="rounded-2xl border border-zinc-850 bg-zinc-950/40 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Consensus Synthesis
              </h2>
            </div>
            <h1 className="text-xl font-bold text-white leading-snug tracking-tight">
              {report.answer}
            </h1>
            <p className="text-sm leading-relaxed text-zinc-350 font-medium">
              {report.summary}
            </p>
          </article>

          {/* Divergence Discrepancy Chart */}
          {report.consensusList && report.consensusList.length > 0 && (
            <DivergenceChart consensus={report.consensusList[0]} />
          )}

          {/* Interactive Recharts */}
          <InteractiveCharts data={report.charts} />

          {/* Scraped Image Grid */}
          {report.images && report.images.length > 0 && (
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950/20 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Extracted Image & Brand Assets
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {report.images.map((img, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden border border-zinc-800 aspect-video group">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex items-end">
                      <span className="text-[10px] font-semibold text-zinc-300 truncate w-full">
                        {img.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Follow-up Chat Companion */}
          <FollowUpChat initialRelated={report.related} reportContext={report} />
        </section>

        {/* Right column: Sources, Confidence, Stat stats (lg:col-span-3) */}
        <aside className="lg:col-span-3 space-y-6">
          {/* Confidence Indicator */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/20 p-6 backdrop-blur-md space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Confidence Index
            </h3>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">{report.confidence}%</div>
                <div className="text-[10px] font-medium text-zinc-500">Credibility Weight Average</div>
              </div>
            </div>
          </div>

          {/* Vetted Sources list */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/20 p-6 backdrop-blur-md space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Vetted Sources ({report.sources.length})
            </h3>
            <div className="space-y-4">
              {report.sources.map((src, idx) => (
                <div key={idx} className="space-y-2.5">
                  <div className="space-y-1">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-white hover:text-indigo-400 hover:underline line-clamp-1 break-all"
                    >
                      {src.title}
                    </a>
                    <span className="inline-block text-[9px] font-semibold text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-850">
                      {new URL(src.url).hostname.replace('www.', '')}
                    </span>
                  </div>
                  <p className="text-[10px] leading-normal text-zinc-450 line-clamp-2">
                    {src.description}
                  </p>
                  <CredibilityScore credibility={src.credibility} />
                  {idx < report.sources.length - 1 && <hr className="border-zinc-900/60 mt-3" />}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <ParticleBackground />
        <RadarScan query="Synthesizing..." />
      </div>
    }>
      <SearchDashboardContent />
    </Suspense>
  );
}
