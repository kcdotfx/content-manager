import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Youtube, 
  Linkedin, 
  Twitter, 
  Calendar,
  MoreHorizontal,
  Trash2,
  Edit
} from 'lucide-react';
import { cn, STATUSES, PRIORITIES, formatRelativeDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const platformIcons = {
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
};

const platformColors = {
  instagram: 'text-pink-500',
  youtube: 'text-red-500',
  linkedin: 'text-blue-500',
  twitter: 'text-cyan-400',
};

export default function PostCard({ post, onDelete, isDragging = false }) {
  const PlatformIcon = platformIcons[post.platform] || Instagram;
  const status = STATUSES.find(s => s.value === post.status);
  const priority = PRIORITIES.find(p => p.value === post.priority);

  return (
    <div 
      className={cn(
        "card-glow bg-zinc-900/40 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all duration-300 group",
        isDragging && "opacity-70 rotate-2 shadow-2xl"
      )}
      data-testid={`post-card-${post.id}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            `bg-platform-${post.platform}`
          )}>
            <PlatformIcon className={cn("h-4 w-4", platformColors[post.platform])} />
          </div>
          <span className="text-xs font-mono uppercase text-zinc-500 tracking-wider">
            {post.content_type}
          </span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              data-testid={`post-menu-${post.id}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10">
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to={`/post/${post.id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-400 cursor-pointer"
              onClick={() => onDelete?.(post.id)}
              data-testid={`delete-post-${post.id}`}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Title */}
      <Link to={`/post/${post.id}`}>
        <h3 className="font-semibold text-white mb-2 hover:text-lime-400 transition-colors line-clamp-2">
          {post.title}
        </h3>
      </Link>

      {/* Description */}
      {post.description && (
        <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
          {post.description}
        </p>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="text-xs font-mono px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded"
            >
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="text-xs font-mono text-zinc-500">
              +{post.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={cn("status-" + post.status, "text-xs font-mono border-0")}
          >
            {status?.label}
          </Badge>
          <Badge 
            variant="outline" 
            className={cn("bg-priority-" + post.priority, `priority-${post.priority}`, "text-xs font-mono border-0")}
          >
            {priority?.label}
          </Badge>
        </div>
        
        {post.scheduled_at && (
          <div className="flex items-center gap-1 text-xs text-zinc-500">
            <Calendar className="h-3 w-3" />
            <span className="font-mono">{formatRelativeDate(post.scheduled_at)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
