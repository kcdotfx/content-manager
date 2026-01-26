import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Lightbulb,
  FileEdit,
  CheckCircle2,
  Send,
  TrendingUp,
  ArrowRight,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  Plus
} from 'lucide-react';
import { getStats, getPosts, deletePost } from '@/lib/api';
import { cn, formatRelativeDate, STATUSES } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import CreatePostDialog from '@/components/CreatePostDialog';
import PostCard from '@/components/PostCard';
import { toast } from 'sonner';

const platformIcons = {
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
};

const platformColors = {
  instagram: '#E1306C',
  youtube: '#FF0000',
  linkedin: '#0077B5',
  twitter: '#1DA1F2',
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsData, postsData] = await Promise.all([
        getStats(),
        getPosts()
      ]);
      setStats(statsData);
      setRecentPosts(postsData.slice(0, 4));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      toast.success('Idea deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete idea');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Ideas',
      value: stats?.total || 0,
      icon: Lightbulb,
      color: 'text-zinc-400',
      bgColor: 'bg-zinc-800/50'
    },
    {
      label: 'In Progress',
      value: stats?.in_progress || 0,
      icon: FileEdit,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
    {
      label: 'Ready',
      value: stats?.ready || 0,
      icon: CheckCircle2,
      color: 'text-lime-400',
      bgColor: 'bg-lime-400/10'
    },
    {
      label: 'Published',
      value: stats?.published || 0,
      icon: Send,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
  ];

  return (
    <div className="space-y-12 animate-fade-in" data-testid="dashboard">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
            Dashboard
          </h1>
          <p className="text-zinc-400">Welcome back, Creator. Here's your content overview.</p>
        </div>
        <CreatePostDialog onCreated={fetchData} />
      </div>

      {/* Stats Grid - Bento Style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="stat-card rounded-xl p-6 hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
              data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}
            >
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4", stat.bgColor)}>
                <Icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-zinc-500 font-mono uppercase tracking-wider">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Platform Breakdown */}
        <div className="lg:col-span-4">
          <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-6" data-testid="platform-stats">
            <h2 className="text-xl font-semibold mb-6">By Platform</h2>
            <div className="space-y-5">
              {Object.entries(stats?.by_platform || {}).map(([platform, count]) => {
                const Icon = platformIcons[platform];
                const color = platformColors[platform];
                const total = stats?.total || 1;
                const percentage = Math.round((count / total) * 100) || 0;

                return (
                  <div key={platform} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="h-4 w-4" style={{ color }} />}
                        <span className="text-sm capitalize">{platform}</span>
                      </div>
                      <span className="text-sm font-mono text-zinc-400">{count}</span>
                    </div>
                    <Progress
                      value={percentage}
                      className="h-1.5 bg-zinc-800"
                      style={{ '--progress-color': color }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pipeline Overview */}
        <div className="lg:col-span-8">
          <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-6" data-testid="pipeline-overview">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Pipeline Overview</h2>
              <Link to="/kanban">
                <Button variant="ghost" size="sm" className="text-lime-400 hover:text-lime-300">
                  View Pipeline <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
              {STATUSES.map((status) => {
                const count = stats?.by_status?.[status.value] || 0;
                return (
                  <div
                    key={status.value}
                    className={cn(
                      "rounded-lg p-4 text-center border border-transparent hover:border-white/10 transition-colors",
                      `status-${status.value}`
                    )}
                  >
                    <p className="text-2xl font-bold mb-1">{count}</p>
                    <p className="text-xs font-mono uppercase tracking-wider opacity-70">{status.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Ideas */}
      <div data-testid="recent-posts">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Ideas</h2>
          <Link to="/ideas">
            <Button variant="ghost" size="sm" className="text-lime-400 hover:text-lime-300">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        {recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentPosts.map((post, index) => (
              <div key={post.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in">
                <PostCard post={post} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-12 text-center">
            <Lightbulb className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No ideas yet</h3>
            <p className="text-zinc-500 mb-6">Start by creating your first content idea</p>
            <CreatePostDialog
              onCreated={fetchData}
              trigger={
                <Button className="bg-lime-400 text-black hover:bg-lime-500">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Idea
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
