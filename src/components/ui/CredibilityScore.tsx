'use client';

import React from 'react';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { SourceCredibility } from '@/lib/credibilityScorer';

interface CredibilityScoreProps {
  credibility: SourceCredibility;
}

export default function CredibilityScore({ credibility }: CredibilityScoreProps) {
  const { score, trustLevel, reasons } = credibility;

  // Gauge colors
  const getColorClass = () => {
    if (trustLevel === 'High') return 'text-emerald-400 stroke-emerald-400';
    if (trustLevel === 'Medium') return 'text-amber-400 stroke-amber-400';
    return 'text-rose-400 stroke-rose-400';
  };

  const getBgColorClass = () => {
    if (trustLevel === 'High') return 'bg-emerald-500/10 border-emerald-500/20';
    if (trustLevel === 'Medium') return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-rose-500/10 border-rose-500/20';
  };

  const getIcon = () => {
    if (trustLevel === 'High') return <ShieldCheck className="h-5 w-5 text-emerald-400" />;
    if (trustLevel === 'Medium') return <Shield className="h-5 w-5 text-amber-400" />;
    return <ShieldAlert className="h-5 w-5 text-rose-400" />;
  };

  // Radial configuration
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`rounded-xl border p-4 backdrop-blur-md transition-all ${getBgColorClass()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          {getIcon()}
          <div>
            <h4 className="text-xs font-semibold tracking-wide uppercase text-zinc-400">
              Source Credibility
            </h4>
            <p className="text-sm font-semibold text-white">
              {trustLevel} Confidence ({score}/100)
            </p>
          </div>
        </div>

        {/* Circular SVG Progress */}
        <div className="relative h-14 w-14 flex items-center justify-center">
          <svg className="h-full w-full -rotate-90 transform">
            <circle
              cx="28"
              cy="28"
              r={radius}
              className="stroke-zinc-800"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="28"
              cy="28"
              r={radius}
              className={`transition-all duration-1000 ${getColorClass()}`}
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-xs font-bold text-white">{score}</span>
        </div>
      </div>

      {reasons.length > 0 && (
        <ul className="mt-3.5 space-y-1.5 border-t border-zinc-800/80 pt-3">
          {reasons.map((reason, idx) => (
            <li key={idx} className="text-xs text-zinc-400 flex items-start space-x-1.5">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
