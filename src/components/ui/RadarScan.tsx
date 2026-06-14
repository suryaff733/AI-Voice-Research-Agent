'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Network, Cpu, FileSearch } from 'lucide-react';

interface RadarScanProps {
  query: string;
}

export default function RadarScan({ query }: RadarScanProps) {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: <FileSearch className="h-5 w-5 text-indigo-400" />, text: 'Generating semantic query variations...' },
    { icon: <Network className="h-5 w-5 text-cyan-400" />, text: 'Querying Context.dev Web Search API...' },
    { icon: <Cpu className="h-5 w-5 text-purple-400" />, text: 'Scraping top 20 sources to Markdown...' },
    { icon: <ShieldCheck className="h-5 w-5 text-emerald-400" />, text: 'Calculating source credibility & confidence...' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      {/* Radar Graphic */}
      <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/20 backdrop-blur-md">
        {/* Concentric Rings */}
        <div className="absolute h-48 w-48 animate-ping rounded-full border border-indigo-500/10 opacity-75 duration-[3s]" />
        <div className="absolute h-32 w-32 animate-ping rounded-full border border-cyan-500/10 opacity-75 duration-[4s]" />
        <div className="absolute h-16 w-16 animate-ping rounded-full border border-purple-500/10 opacity-75 duration-[2s]" />

        {/* Outer Circular Grid */}
        <div className="absolute h-56 w-56 rounded-full border border-dashed border-zinc-800" />
        <div className="absolute h-40 w-40 rounded-full border border-dotted border-zinc-800" />

        {/* Center glowing core */}
        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
          <Network className="h-6 w-6 text-indigo-400 animate-pulse" />
        </div>

        {/* Rotating sweep line */}
        <div className="absolute inset-0 h-full w-full animate-spin rounded-full [animation-duration:6s] pointer-events-none">
          <div className="h-1/2 w-1 bg-gradient-to-t from-indigo-500/40 to-transparent origin-bottom mx-auto" />
        </div>

        {/* Floating Scraped Nodes */}
        <div className="absolute top-12 left-10 h-3 w-3 rounded-full bg-cyan-400 animate-pulse delay-700 shadow-[0_0_10px_#22d3ee]" />
        <div className="absolute bottom-16 right-12 h-2.5 w-2.5 rounded-full bg-purple-400 animate-pulse delay-300 shadow-[0_0_10px_#c084fc]" />
        <div className="absolute top-20 right-16 h-2 w-2 rounded-full bg-indigo-400 animate-pulse delay-1000 shadow-[0_0_10px_#818cf8]" />
      </div>

      {/* Query Banner */}
      <h2 className="mt-8 text-xl font-medium tracking-tight text-white max-w-md text-center">
        Deep Researching: &quot;{query}&quot;
      </h2>

      {/* Progress Stepper */}
      <div className="mt-8 w-full max-w-md space-y-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 backdrop-blur-xl">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className={`flex items-center space-x-4 transition-all duration-500 ${
              idx <= step ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-2'
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700">
              {idx < step ? (
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              ) : (
                s.icon
              )}
            </div>
            <span className="text-sm font-medium text-zinc-300">
              {s.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
