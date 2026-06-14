'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { BarChart3, LineChart as LineIcon, AreaChart as AreaIcon } from 'lucide-react';

interface ChartData {
  name: string;
  [key: string]: string | number;
}

interface InteractiveChartsProps {
  data: ChartData[];
  title?: string;
}

export default function InteractiveCharts({ data, title = 'Extracted Statistics Trend' }: InteractiveChartsProps) {
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line'>('area');

  if (!data || data.length === 0) return null;

  // Determine the numerical key to plot dynamically
  const keys = Object.keys(data[0]).filter(k => k !== 'name');
  const primaryKey = keys[0] || 'value';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/90 p-3 shadow-xl backdrop-blur-md">
          <p className="text-xs font-semibold text-zinc-400">{label}</p>
          <p className="mt-1 text-sm font-bold text-indigo-400">
            {payload[0].value.toLocaleString()} {primaryKey}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-zinc-850 bg-zinc-950/40 p-6 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">{title}</h3>
          <p className="text-xs text-zinc-400 font-medium">Visualizing {primaryKey} over segments</p>
        </div>

        {/* Chart Toggle Buttons */}
        <div className="flex items-center space-x-1.5 rounded-lg bg-zinc-900/80 p-1 border border-zinc-800">
          <button
            onClick={() => setChartType('area')}
            className={`rounded-md p-1.5 transition-all ${
              chartType === 'area' ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Area Chart"
          >
            <AreaIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`rounded-md p-1.5 transition-all ${
              chartType === 'bar' ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Bar Chart"
          >
            <BarChart3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`rounded-md p-1.5 transition-all ${
              chartType === 'line' ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Line Chart"
          >
            <LineIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.2} />
              <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={primaryKey}
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          ) : chartType === 'bar' ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.2} />
              <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={primaryKey} fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.2} />
              <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={primaryKey}
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ stroke: '#6366f1', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
