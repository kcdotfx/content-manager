import { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarDays, Instagram, Youtube, Linkedin, Twitter } from 'lucide-react';
import { getPosts } from '@/lib/api';
import { cn, STATUSES } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CreatePostDialog from '@/components/CreatePostDialog';
import { Link } from 'react-router-dom';

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

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getPostsForDay = (day) => {
    return posts.filter(post => {
      if (post.scheduled_at) {
        const scheduledDate = parseISO(post.scheduled_at);
        return isSameDay(scheduledDate, day);
      }
      if (post.published_at) {
        const publishedDate = parseISO(post.published_at);
        return isSameDay(publishedDate, day);
      }
      return false;
    });
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" data-testid="calendar-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
            Calendar
          </h1>
          <p className="text-zinc-400">Schedule and track your content publishing</p>
        </div>
        <CreatePostDialog onCreated={fetchPosts} />
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between bg-zinc-900/40 border border-white/5 rounded-xl p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="h-10 w-10"
          data-testid="prev-month-btn"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="h-10 w-10"
          data-testid="next-month-btn"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-zinc-900/40 border border-white/5 rounded-xl overflow-hidden" data-testid="calendar-grid">
        {/* Week Headers */}
        <div className="grid grid-cols-7 border-b border-white/5">
          {weekDays.map((day) => (
            <div 
              key={day}
              className="p-3 text-center text-sm font-mono uppercase tracking-wider text-zinc-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayPosts = getPostsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={index}
                className={cn(
                  "min-h-[120px] p-2 border-b border-r border-white/5 transition-colors",
                  !isCurrentMonth && "bg-zinc-950/50",
                  isCurrentDay && "bg-lime-400/5"
                )}
                data-testid={`calendar-day-${format(day, 'yyyy-MM-dd')}`}
              >
                {/* Day Number */}
                <div className="flex items-center justify-between mb-2">
                  <span 
                    className={cn(
                      "text-sm font-mono",
                      !isCurrentMonth && "text-zinc-600",
                      isCurrentDay && "text-lime-400 font-bold"
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                  {isCurrentDay && (
                    <Badge className="bg-lime-400 text-black text-[10px] px-1.5 py-0">
                      Today
                    </Badge>
                  )}
                </div>

                {/* Posts for day */}
                <div className="space-y-1">
                  {dayPosts.slice(0, 3).map((post) => {
                    const PlatformIcon = platformIcons[post.platform];
                    const status = STATUSES.find(s => s.value === post.status);
                    return (
                      <Link
                        key={post.id}
                        to={`/post/${post.id}`}
                        className={cn(
                          "block p-1.5 rounded text-xs truncate transition-colors hover:brightness-110",
                          `status-${post.status}`
                        )}
                        title={post.title}
                      >
                        <div className="flex items-center gap-1">
                          {PlatformIcon && (
                            <PlatformIcon 
                              className="h-3 w-3 flex-shrink-0"
                              style={{ color: platformColors[post.platform] }}
                            />
                          )}
                          <span className="truncate">{post.title}</span>
                        </div>
                      </Link>
                    );
                  })}
                  {dayPosts.length > 3 && (
                    <p className="text-[10px] text-zinc-500 font-mono">
                      +{dayPosts.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-zinc-900/40 border border-white/5 rounded-xl">
        <span className="text-sm text-zinc-500 font-medium">Status:</span>
        {STATUSES.map((status) => (
          <div key={status.value} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: status.color }}
            />
            <span className="text-xs font-mono text-zinc-400">{status.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
