import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal } from 'lucide-react';
import { getPosts, updatePostStatus, deletePost } from '@/lib/api';
import { cn, STATUSES } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import CreatePostDialog from '@/components/CreatePostDialog';
import PostCard from '@/components/PostCard';
import { toast } from 'sonner';

export default function Kanban() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('Failed to load pipeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    // Optimistic update
    setPosts(prev => prev.map(post => 
      post.id === draggableId ? { ...post, status: newStatus } : post
    ));

    try {
      await updatePostStatus(draggableId, newStatus);
      toast.success(`Moved to ${STATUSES.find(s => s.value === newStatus)?.label}`);
    } catch (error) {
      // Revert on error
      fetchPosts();
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      toast.success('Post deleted');
      fetchPosts();
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const getColumnPosts = (status) => {
    return posts.filter(post => post.status === status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" data-testid="kanban-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
            Pipeline
          </h1>
          <p className="text-zinc-400">Drag and drop to update content status</p>
        </div>
        <CreatePostDialog onCreated={fetchPosts} />
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-6 min-w-max" data-testid="kanban-board">
            {STATUSES.map((status) => {
              const columnPosts = getColumnPosts(status.value);
              return (
                <div 
                  key={status.value}
                  className="w-[300px] flex-shrink-0"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <h3 className="font-semibold text-sm">{status.label}</h3>
                      <Badge 
                        variant="secondary" 
                        className="bg-zinc-800 text-zinc-400 font-mono text-xs"
                      >
                        {columnPosts.length}
                      </Badge>
                    </div>
                  </div>

                  {/* Droppable Column */}
                  <Droppable droppableId={status.value}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                          "kanban-column rounded-xl p-3 transition-colors",
                          snapshot.isDraggingOver 
                            ? "bg-lime-400/5 border-2 border-dashed border-lime-400/30" 
                            : "bg-zinc-900/30 border border-white/5"
                        )}
                        data-testid={`kanban-column-${status.value}`}
                      >
                        <div className="space-y-3 min-h-[200px]">
                          {columnPosts.map((post, index) => (
                            <Draggable 
                              key={post.id} 
                              draggableId={post.id} 
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  data-testid={`draggable-${post.id}`}
                                >
                                  <PostCard 
                                    post={post} 
                                    onDelete={handleDelete}
                                    isDragging={snapshot.isDragging}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>

                        {/* Add card button */}
                        {status.value === 'idea' && (
                          <CreatePostDialog 
                            onCreated={fetchPosts}
                            trigger={
                              <button 
                                className="w-full mt-3 p-3 rounded-lg border border-dashed border-white/10 text-zinc-500 hover:border-lime-400/30 hover:text-lime-400 transition-colors flex items-center justify-center gap-2"
                                data-testid="add-idea-btn"
                              >
                                <Plus className="h-4 w-4" />
                                <span className="text-sm">Add Idea</span>
                              </button>
                            }
                          />
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DragDropContext>
    </div>
  );
}
