'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

interface ResearchTimelineProps {
  events: TimelineEvent[];
}

export default function ResearchTimeline({ events }: ResearchTimelineProps) {
  if (events.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 pb-2 border-b border-zinc-900">
        <Calendar className="h-4 w-4 text-indigo-400" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Research Timeline
        </h3>
      </div>

      <div className="relative border-l border-zinc-800 pl-4 ml-2 space-y-6">
        {events.map((event, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-950 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] group-hover:scale-125 transition-transform" />

            <div className="space-y-1">
              <span className="inline-block rounded bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 text-[10px] font-bold text-zinc-400">
                {event.date}
              </span>
              <h4 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                {event.title}
              </h4>
              <p className="text-xs leading-relaxed text-zinc-400 font-medium">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
