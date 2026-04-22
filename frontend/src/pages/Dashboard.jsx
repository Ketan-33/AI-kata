import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PillButton from '../components/ui/PillButton.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import EpisodeCard from '../components/ui/EpisodeCard.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import SplitCTASection from '../components/ui/SplitCTASection.jsx';
import SocialFollowSection from '../components/ui/SocialFollowSection.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';
import LoadingSpinner from '../components/shared/LoadingSpinner.jsx';
import ErrorBanner from '../components/shared/ErrorBanner.jsx';
import { fetchSummary, selectDashboard } from '../store/dashboardSlice.js';
import useEpisodes from '../hooks/useEpisodes.js';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { summary, status, error } = useSelector(selectDashboard);
  const episodes = useEpisodes('all');

  useEffect(() => { dispatch(fetchSummary()); }, [dispatch]);

  const counts = summary?.counts || { total: 0, published: 0, draft: 0, scripted: 0, guests: 0 };
  const recent = (summary?.recent || episodes.items || []).slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="bg-bg-primary">
        <div className="max-w-page mx-auto px-6 py-20 md:py-28 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="h-display">All the tools to grow your show</h1>
            <p className="mt-6 text-lg md:text-xl text-text-secondary max-w-xl">
              Plan episodes, manage guests, generate AI scripts — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PillButton as={Link} to="/episodes/new" variant="primary">
                Create Episode →
              </PillButton>
              <PillButton as={Link} to="/analytics" variant="outline">
                View Analytics
              </PillButton>
            </div>
          </div>

          <div className="relative h-[420px] hidden lg:block">
            <div className="absolute top-0 left-6 w-72 card-dark p-5 rotate-[-3deg]">
              <span className="inline-block rounded-pill bg-status-scripted/30 text-white text-xs font-bold px-3 py-1">
                Scripted ✅
              </span>
              <h4 className="mt-3 font-bold">Ep 14 — Bootstrapping in Public</h4>
              <p className="text-text-secondary text-sm mt-1">Guest: Sarah Chen</p>
            </div>
            <div className="absolute top-32 right-0 w-80 card-dark p-5 rotate-[2deg] border border-accent-lime/40">
              <p className="text-sm text-text-secondary">AI suggestion</p>
              <p className="mt-1 font-bold">Generate questions for this guest?</p>
              <PillButton variant="lime" size="sm" className="mt-3">
                ✨ Generate
              </PillButton>
            </div>
            <div className="absolute bottom-0 left-20 card-dark p-6">
              <p className="text-text-secondary text-sm">Streams</p>
              <p className="text-5xl font-black">204K</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-bg-primary pb-12">
        <div className="max-w-page mx-auto px-6">
          {status === 'loading' && <LoadingSpinner label="Loading summary…" />}
          <ErrorBanner error={error} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon="🎙️" title="Total Episodes" value={counts.total ?? 0} />
            <StatCard icon="✅" title="Published" value={counts.published ?? 0} />
            <StatCard icon="📝" title="Drafts" value={counts.draft ?? 0} />
            <StatCard icon="👥" title="Guests" value={counts.guests ?? 0} />
          </div>
        </div>
      </section>

      {/* Recent Episodes */}
      <section className="bg-bg-purple text-text-dark py-16 md:py-24">
        <div className="max-w-page mx-auto px-6">
          <SectionHeader
            tone="light"
            title="Recent Episodes"
            subtitle="Pick up where you left off."
            cta={
              <PillButton as={Link} to="/episodes" variant="primary">
                View all →
              </PillButton>
            }
          />
          {episodes.status === 'loading' ? (
            <LoadingSpinner />
          ) : recent.length === 0 ? (
            <EmptyState
              icon="🎬"
              title="No episodes yet"
              description="Create your first episode to start planning."
              action={
                <PillButton as={Link} to="/episodes/new" variant="primary">
                  Create Episode
                </PillButton>
              }
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recent.map((ep) => (
                <EpisodeCard key={ep.id} episode={ep} variant="tile" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Split CTA */}
      <SplitCTASection
        left={{
          icon: '🤖',
          title: 'Need a script fast?',
          description: 'Let AI draft your intro, outro, and main content in seconds.',
          ctaLabel: 'Generate with AI',
          href: '/scripts',
        }}
        right={{
          icon: '👥',
          title: 'Managing guests?',
          description: 'Build a roster, track expertise, and link them to episodes.',
          ctaLabel: 'Add a Guest',
          href: '/guests',
        }}
      />

      <SocialFollowSection />
    </div>
  );
}
