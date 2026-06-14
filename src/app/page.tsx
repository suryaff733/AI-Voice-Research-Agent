'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, TrendingUp, Cpu, Users, Eye } from 'lucide-react';
import ParticleBackground from '@/components/ui/ParticleBackground';

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Example prompts
  const examples = [
    'How many AirPods were sold this year?',
    'Tesla market share in Europe',
    'Best AI startups in India 2026',
    'React vs Vue adoption statistics'
  ];

  // Live Counter Simulation
  const [liveQueries, setLiveQueries] = useState(142058);
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveQueries((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleExampleClick = (ex: string) => {
    router.push(`/search?q=${encodeURIComponent(ex)}`);
  };

  // Tracking mouse for glow spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-black text-white font-sans flex flex-col selection:bg-indigo-500/30"
    >
      {/* Background Particles & Aurora blobs */}
      <ParticleBackground />
      <div className="pointer-events-none fixed -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[150px]" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[150px]" />

      {/* Spotlight mouse glow */}
      <div
        className="pointer-events-none absolute h-[350px] w-[350px] rounded-full bg-indigo-500/5 blur-[100px] transition-opacity duration-300"
        style={{
          left: `${mousePosition.x - 175}px`,
          top: `${mousePosition.y - 175}px`,
        }}
      />

      {/* Header Bar */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full border-b border-zinc-900/50">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-md font-bold tracking-wider uppercase bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Research Universe
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline-flex items-center text-xs font-bold text-zinc-400 bg-zinc-900/50 border border-zinc-800/80 px-3 py-1.5 rounded-full backdrop-blur-md">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {liveQueries.toLocaleString()} reports generated
          </span>
        </div>
      </header>

      {/* Hero Body */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full px-6 py-12 md:py-24 text-center">
        {/* Glow badge */}
        <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-950/20 px-3.5 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md animate-fade-in">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-Generation Research Synthesizer</span>
        </div>

        {/* Hero Title */}
        <h1 className="mt-6 text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Search Less.<br />
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent">
            Know More.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-md md:text-lg text-zinc-400 font-medium">
          Deep internet research synthesized instantly. Scrapes the live web, cross-references claims, scores source credibility, and resolves contradictions.
        </p>

        {/* Animated Search Bar container */}
        <form
          onSubmit={handleSearchSubmit}
          className="mt-10 w-full max-w-2xl relative rounded-2xl border border-zinc-800 bg-zinc-900/30 p-2 backdrop-blur-xl hover:border-zinc-700 transition-all shadow-[0_0_30px_rgba(99,102,241,0.15)] group"
        >
          <div className="flex items-center">
            <Search className="ml-3 h-5 w-5 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything (e.g. How many AirPods were sold this year?)"
              className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:from-indigo-500 hover:to-indigo-400 transition-all"
            >
              Analyze
            </button>
          </div>
        </form>

        {/* Examples Chips */}
        <div className="mt-5 flex flex-wrap justify-center gap-2 max-w-2xl">
          {examples.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleExampleClick(ex)}
              className="rounded-full border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900 hover:border-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-all backdrop-blur-md"
            >
              {ex}
            </button>
          ))}
        </div>

        {/* 3D Features Showcase */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {/* Card 1 */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/20 p-6 text-left backdrop-blur-md hover:border-zinc-800 transition-all hover:-translate-y-1">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-white">Consensus & Discrepancies</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400 font-medium">
              We group contradictory source figures, detect data ranges, and calculate mathematical AI averages to ensure factual precision.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/20 p-6 text-left backdrop-blur-md hover:border-zinc-800 transition-all hover:-translate-y-1">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-white">Scrape & Structure</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400 font-medium">
              Ingests raw URLs into structured Markdown, stripping junk ads/menus. Extracts images, product schemas, and publication timelines.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/20 p-6 text-left backdrop-blur-md hover:border-zinc-800 transition-all hover:-translate-y-1">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Eye className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-white">Trust & Credibility</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400 font-medium">
              Calculates credibility weights out of 100 based on security protocols, domain suffixes, and alignment with peer consensus.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-900/50 py-6 px-8 max-w-7xl mx-auto w-full text-center text-xs text-zinc-500 font-medium">
        &copy; {new Date().getFullYear()} Research Universe Inc. Powered by Context.dev & OpenAI. All rights reserved.
      </footer>
    </div>
  );
}
