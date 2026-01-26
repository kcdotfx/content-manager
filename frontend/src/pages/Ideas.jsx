import { useState, useEffect, useCallback } from 'react';
import { Lightbulb, Grid3X3, List } from 'lucide-react';
import { getPosts, deletePost } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import CreatePostDialog from '@/components/CreatePostDialog';
import FilterBar from '@/components/FilterBar';
import PostCard from '@/components/PostCard';
import { toast } from 'sonner';

export default function Ideas() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    platform: '',
    status: '',
    content_type: '',
    priority: '',
    search: '',
  });

  const fetchPosts = useCallback(async () => {
    try {
      const data = await getPosts(filters);
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('Failed to load ideas');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      toast.success('Idea deleted');
      fetchPosts();
    } catch (error) {
      toast.error('Failed to delete idea');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" data-testid="ideas-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
            Ideas
          </h1>
          <p className="text-zinc-400">
            {posts.length} content {posts.length === 1 ? 'idea' : 'ideas'} in your library
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-zinc-900 rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('grid')}
              className={cn(
                "h-8 w-8 rounded-md",
                viewMode === 'grid' && "bg-zinc-800"
              )}
              data-testid="grid-view-btn"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('list')}
              className={cn(
                "h-8 w-8 rounded-md",
                viewMode === 'list' && "bg-zinc-800"
              )}
              data-testid="list-view-btn"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <CreatePostDialog onCreated={fetchPosts} />
        </div>
      </div>

      {/* Filters */}
      <FilterBar filters={filters} setFilters={setFilters} />

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-[40vh]">
          <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length > 0 ? (
        <div 
          className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
              : "flex flex-col gap-3"
          )}
          data-testid="ideas-list"
        >
          {posts.map((post, index) => (
            <div 
              key={post.id} 
              style={{ animationDelay: `${index * 50}ms` }} 
              className="animate-fade-in"
            >
              <PostCard post={post} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-12 text-center">
          <Lightbulb className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No ideas found</h3>
          <p className="text-zinc-500 mb-6">
            {filters.search || filters.platform || filters.status || filters.content_type || filters.priority
              ? "Try adjusting your filters"
              : "Start by creating your first content idea"
            }
          </p>
          {!filters.search && !filters.platform && !filters.status && (
            <CreatePostDialog 
              onCreated={fetchPosts}
              trigger={
                <Button className="bg-lime-400 text-black hover:bg-lime-500">
                  Create First Idea
                </Button>
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
