'use client';

import React from 'react';
import { TopicConsensus } from '@/lib/discrepancyResolver';
import { GitCompare, Sparkles, TrendingUp } from 'lucide-react';

interface DivergenceChartProps {
  consensus: TopicConsensus;
}

export default function DivergenceChart({ consensus }: DivergenceChartProps) {
  const { topic, claims, consensusValue, confidence, discrepancyDetected, explanation } = consensus;

  if (claims.length === 0) return null;

  const maxVal = Math.max(...claims.map(c => c.value));

  return (
    <div className="rounded-2xl border border-zinc-850 bg-zinc-950/40 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <GitCompare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Source Discrepancy Comparison</h3>
            <p className="text-xs text-zinc-400 font-medium">{topic}</p>
          </div>
        </div>

        {discrepancyDetected ? (
          <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 text-xs font-semibold text-rose-400 animate-pulse">
            Discrepancy Detected
          </span>
        ) : (
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400">
            High Consensus
          </span>
        )}
      </div>

      {/* Comparisons */}
      <div className="mt-5 space-y-4">
        {claims.map((claim, idx) => {
          const percentage = maxVal > 0 ? (claim.value / maxVal) * 100 : 0;
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-zinc-300 font-semibold">{claim.sourceName}</span>
                <span className="text-zinc-400">{claim.rawStr}</span>
              </div>
              <div className="relative h-2 w-full rounded-full bg-zinc-900 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-zinc-700 to-zinc-500 transition-all duration-1000"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* AI Consensus Block */}
        <div className="mt-6 rounded-xl border border-indigo-500/20 bg-indigo-950/15 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                AI Consensus Synthesis
              </span>
            </div>
            <div className="flex items-center space-x-1 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-bold">{confidence}% Confidence</span>
            </div>
          </div>

          <div className="text-lg font-bold text-white tracking-tight">
            {consensusValue}
          </div>

          <p className="text-xs leading-relaxed text-zinc-300 font-medium">
            {explanation}
          </p>
        </div>
      </div>
    </div>
  );
}
