'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Eye, Users, MessageSquare, Target, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalVisitors: number;
    totalSessions: number;
    totalPageViews: number;
    totalProductViews: number;
    totalEnquiries: number;
    conversionRate: string;
  };
  topCars: Array<{
    car: {
      id: string;
      make: string;
      model: string;
      year: number;
      price: number;
      images: string[];
      status: string;
    };
    views: number;
    avgDuration: number;
    avgScroll: number;
    enquiries: number;
    conversionRate: string;
  }>;
  funnel: Array<{
    stage: string;
    count: number;
    percentage: number | string;
  }>;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetch(`/api/analytics/dashboard?days=${days}`)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [days]);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-64 bg-slate-800 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-800 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-8 text-red-400">Failed to load analytics</div>;

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Product Analytics</h1>
          <p className="text-slate-400 mt-1">Enterprise-grade insights into car performance & engagement</p>
        </div>
        <div className="flex gap-2">
          {[7, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${days === d
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <KPICard
          icon={<Users className="w-5 h-5" />}
          label="Visitors"
          value={data.overview.totalVisitors.toLocaleString()}
          color="blue"
        />
        <KPICard
          icon={<Eye className="w-5 h-5" />}
          label="Page Views"
          value={data.overview.totalPageViews.toLocaleString()}
          color="indigo"
        />
        <KPICard
          icon={<Target className="w-5 h-5" />}
          label="Product Views"
          value={data.overview.totalProductViews.toLocaleString()}
          color="purple"
        />
        <KPICard
          icon={<MessageSquare className="w-5 h-5" />}
          label="Enquiries"
          value={data.overview.totalEnquiries.toLocaleString()}
          color="emerald"
        />
        <KPICard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Conversion"
          value={`${data.overview.conversionRate}%`}
          color="amber"
        />
        <KPICard
          icon={<Clock className="w-5 h-5" />}
          label="Sessions"
          value={data.overview.totalSessions.toLocaleString()}
          color="pink"
        />
      </div>

      {/* Conversion Funnel */}
      <div className="bg-card/40 backdrop-blur-xl rounded-3xl p-6 border border-white/5 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Conversion Funnel
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.funnel.map((stage, idx) => (
            <div key={stage.stage} className="relative">
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-white/5">
                <div className="text-sm text-slate-400 mb-2">{stage.stage}</div>
                <div className="text-3xl font-bold text-white mb-1">{stage.count.toLocaleString()}</div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-primary font-bold">{stage.percentage}%</span>
                  {idx > 0 && (
                    <span className="text-slate-500 text-xs">
                      ({((stage.count / data.funnel[idx - 1].count) * 100).toFixed(1)}% from prev)
                    </span>
                  )}
                </div>
              </div>
              {idx < data.funnel.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-slate-600">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Cars */}
      <div className="bg-card/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-xl">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Top Performing Cars
          </h2>
          <p className="text-sm text-slate-400 mt-1">Ranked by views, engagement & conversion</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-white/5">
              <tr>
                <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Car</th>
                <th className="text-right p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Views</th>
                <th className="text-right p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Time</th>
                <th className="text-right p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Scroll %</th>
                <th className="text-right p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Enquiries</th>
                <th className="text-right p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Conv Rate</th>
                <th className="text-right p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.topCars.map((item, idx) => (
                <tr key={item.car.id} className="border-b border-white/5 hover:bg-slate-900/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden relative flex-shrink-0">
                        {item.car.images[0] && (
                          <img
                            src={item.car.images[0]}
                            alt={item.car.model}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">
                          {item.car.year} {item.car.make} {item.car.model}
                        </div>
                        <div className="text-xs text-slate-400">${item.car.price.toLocaleString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-bold text-white">{item.views}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-sm text-slate-300">{Math.round(item.avgDuration / 1000)}s</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-sm text-slate-300">{item.avgScroll}%</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-bold text-emerald-400">{item.enquiries}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${parseFloat(item.conversionRate) > 5
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : parseFloat(item.conversionRate) > 2
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-slate-700 text-slate-400'
                      }`}>
                      {parseFloat(item.conversionRate) > 5 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {item.conversionRate}%
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className={`text-xs uppercase font-bold px-2 py-1 rounded-full ${item.car.status === 'AVAILABLE'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/20 text-red-400'
                      }`}>
                      {item.car.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    indigo: 'bg-indigo-500/20 text-indigo-400',
    purple: 'bg-purple-500/20 text-purple-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/20 text-amber-400',
    pink: 'bg-pink-500/20 text-pink-400',
  };

  return (
    <div className="bg-card/40 backdrop-blur-xl rounded-2xl p-4 border border-white/5 shadow-xl">
      <div className={`w-10 h-10 rounded-xl ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}
