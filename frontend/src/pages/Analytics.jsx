import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import StatCard from '../components/ui/StatCard.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import SocialFollowSection from '../components/ui/SocialFollowSection.jsx';
import LoadingSpinner from '../components/shared/LoadingSpinner.jsx';
import ErrorBanner from '../components/shared/ErrorBanner.jsx';
import { fetchSummary, selectDashboard } from '../store/dashboardSlice.js';

const sampleStreams = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  streams: Math.round(2000 + Math.sin(i / 3) * 800 + i * 60),
}));

const sampleByStatus = [
  { status: 'Draft', count: 4 },
  { status: 'Scripted', count: 6 },
  { status: 'Published', count: 18 },
];

export default function Analytics() {
  const dispatch = useDispatch();
  const { summary, status, error } = useSelector(selectDashboard);

  useEffect(() => { dispatch(fetchSummary()); }, [dispatch]);

  const streams = summary?.streams || sampleStreams;
  const byStatus = summary?.byStatus || sampleByStatus;
  const totals = summary?.counts || {};

  return (
    <div>
      <section className="bg-bg-purple text-text-dark py-16">
        <div className="max-w-page mx-auto px-6">
          <SectionHeader
            tone="light"
            title="Your Show Analytics"
            subtitle="Track growth, top guests, and AI usage at a glance."
          />
        </div>
      </section>

      <section className="bg-bg-primary py-12">
        <div className="max-w-page mx-auto px-6 flex flex-col gap-10">
          {status === 'loading' && <LoadingSpinner label="Loading analytics…" />}
          <ErrorBanner error={error} />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon="📈" title="Total Streams" value={summary?.totalStreams ?? '204K'} trend="+12%" />
            <StatCard icon="⏱️" title="Avg Length" value={summary?.avgLength ?? '42min'} />
            <StatCard icon="⭐" title="Top Guest" value={summary?.topGuest ?? 'Sarah Chen'} />
            <StatCard icon="🤖" title="AI Scripts" value={summary?.aiGenerations ?? totals.aiGenerations ?? 17} />
          </div>

          <div className="card-dark p-6">
            <h3 className="text-lg font-bold mb-4">Streams — last 30 days</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={streams}>
                  <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                  <XAxis dataKey="day" stroke="#B3B3B3" />
                  <YAxis stroke="#B3B3B3" />
                  <Tooltip contentStyle={{ background: '#121212', border: '1px solid #2a2a2a' }} />
                  <Line type="monotone" dataKey="streams" stroke="#1DB954" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-dark p-6">
            <h3 className="text-lg font-bold mb-4">Episodes by status</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byStatus}>
                  <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                  <XAxis dataKey="status" stroke="#B3B3B3" />
                  <YAxis stroke="#B3B3B3" />
                  <Tooltip contentStyle={{ background: '#121212', border: '1px solid #2a2a2a' }} />
                  <Bar dataKey="count" fill="#7B5EA7" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      <SocialFollowSection />
    </div>
  );
}
