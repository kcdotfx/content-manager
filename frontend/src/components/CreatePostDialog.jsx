import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { cn, PLATFORMS, CONTENT_TYPES, PRIORITIES } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createPost } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function CreatePostDialog({ onCreated, trigger }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform: 'instagram',
    content_type: 'reel',
    priority: 'medium',
    tags: [],
    user_id: user?.id || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setLoading(true);
    try {
      await createPost(formData);
      toast.success('Content idea created!');
      setOpen(false);
      setFormData({
        title: '',
        description: '',
        platform: 'instagram',
        content_type: 'reel',
        priority: 'medium',
        tags: [],
        user_id: user?.id || '',
      });
      onCreated?.();
    } catch (error) {
      toast.error('Failed to create post');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            className="h-10 px-6 rounded-full bg-lime-400 text-black font-bold hover:bg-lime-500 hover:scale-105 transition-all"
            data-testid="create-post-btn"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Idea
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-white/10 max-w-lg" data-testid="create-post-dialog">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Idea</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What's your content idea?"
              className="bg-zinc-950/50 border-white/10 focus:border-lime-400/50"
              data-testid="post-title-input"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description / Hook</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your idea or hook..."
              className="bg-zinc-950/50 border-white/10 focus:border-lime-400/50 resize-none"
              rows={3}
              data-testid="post-description-input"
            />
          </div>

          {/* Platform & Content Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
              >
                <SelectTrigger className="bg-zinc-950/50 border-white/10" data-testid="platform-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10">
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Content Type</Label>
              <Select
                value={formData.content_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, content_type: value }))}
              >
                <SelectTrigger className="bg-zinc-950/50 border-white/10" data-testid="content-type-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10">
                  {CONTENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
            >
              <SelectTrigger className="bg-zinc-950/50 border-white/10" data-testid="priority-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/10">
                {PRIORITIES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <span style={{ color: p.color }}>{p.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a tag..."
                className="bg-zinc-950/50 border-white/10 focus:border-lime-400/50"
                data-testid="tag-input"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                className="border-white/10"
                data-testid="add-tag-btn"
              >
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs font-mono px-2 py-1 bg-lime-400/10 text-lime-400 border border-lime-400/20 rounded"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-lime-400 text-black hover:bg-lime-500"
              data-testid="submit-post-btn"
            >
              {loading ? 'Creating...' : 'Create Idea'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
