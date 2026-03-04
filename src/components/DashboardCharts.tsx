'use client';

import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Appointment } from '@/hooks/useAppointments';

interface DashboardChartsProps {
  appointments: Appointment[];
}

const SOURCE_COLORS: Record<string, string> = {
  'Manual': '#3b82f6', // blue-500
  'RetellAI': '#10b981', // emerald-500
  'n8n Webhook': '#f59e0b', // amber-500
  'Other': '#8b5cf6', // violet-500
};

export function DashboardCharts({ appointments }: DashboardChartsProps) {
  const locale = useLocale();
  const isEs = locale === 'es';

  // 1. Process Data for Source Pie Chart
  const sourceData = useMemo(() => {
    const counts: Record<string, number> = {};
    appointments.forEach((apt) => {
      const source = apt.source || 'Manual';
      counts[source] = (counts[source] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: SOURCE_COLORS[name] || SOURCE_COLORS['Other'],
    }));
  }, [appointments]);

  // 2. Process Data for Peak Hours Bar Chart
  const hoursData = useMemo(() => {
    const hoursCount: Record<string, number> = {};
    
    // Initialize standard hours 8 AM to 6 PM with 0
    for (let i = 8; i <= 18; i++) {
      const hourStr = `${i.toString().padStart(2, '0')}:00`;
      hoursCount[hourStr] = 0;
    }

    appointments.forEach((apt) => {
      if (!apt.time) return;
      const hourStr = apt.time.substring(0, 2) + ':00'; // Extract "09", "10", etc.
      hoursCount[hourStr] = (hoursCount[hourStr] || 0) + 1;
    });

    return Object.entries(hoursCount)
      .map(([hour, count]) => {
        const hourNum = parseInt(hour, 10);
        let formattedHour = hour;
        if (hourNum === 12) formattedHour = '12 PM';
        else if (hourNum > 12) formattedHour = `${hourNum - 12} PM`;
        else formattedHour = `${hourNum} AM`;

        return {
          hour: formattedHour,
          rawHour: hour, // Used for sorting if necessary
          count,
        };
      })
      .sort((a, b) => a.rawHour.localeCompare(b.rawHour));
  }, [appointments]);

  // Custom generic Tooltip Content for dark theme
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-slate-300 font-medium mb-1">{label || payload[0].payload.name}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm font-semibold text-white">
              <div 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: entry.color || entry.payload.fill || '#3b82f6' }} 
              />
              {entry.value} {isEs ? 'citas' : 'appointments'}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!appointments.length) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 animate-in fade-in duration-700 delay-200 fill-mode-both">
      
      {/* Appointments by Source */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <h3 className="text-lg font-semibold text-white mb-6">
          {isEs ? 'Citas por Origen' : 'Appointments by Source'}
        </h3>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Custom Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          {sourceData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm text-slate-300 font-medium">
              <div className="w-3 h-3 rounded-sm shadow-sm" style={{ backgroundColor: entry.color }} />
              {entry.name} <span className="text-slate-500 ml-1">({entry.value})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Peak Hours Chart */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-lg relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <h3 className="text-lg font-semibold text-white mb-6">
          {isEs ? 'Horas Pico (Histórico)' : 'Peak Hours (All Time)'}
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={hoursData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="hour" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.4 }} />
              <Bar 
                dataKey="count" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              >
                {/* Dynamically coloring bars to create a gradient effect instead of plain blue */}
                {hoursData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#3b82f6' : '#1e293b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
