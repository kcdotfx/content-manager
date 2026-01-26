import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Instagram, 
  Youtube, 
  Linkedin, 
  Twitter,
  X,
  Check,
  Calendar
} from 'lucide-react';
import { getPost, updatePost, deletePost } from '@/lib/api';
import { cn, PLATFORMS, CONTENT_TYPES, STATUSES, PRIORITIES, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const platformIcons = {
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
};

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPost(id);
        setPost(data);
      } catch (error) {
        toast.error('Post not found');
        navigate('/ideas');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePost(id, post);
      toast.success('Changes saved!');
    } catch (error) {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(id);
      toast.success('Post deleted');
      navigate('/ideas');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !post.tags.includes(tagInput.trim())) {
      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addHashtag = () => {
    const hashtag = hashtagInput.startsWith('#') ? hashtagInput : `#${hashtagInput}`;
    if (hashtagInput.trim() && !post.hashtags.includes(hashtag)) {
      setPost(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtag]
      }));
      setHashtagInput('');
    }
  };

  const removeHashtag = (hashtag) => {
    setPost(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(h => h !== hashtag)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) return null;

  const PlatformIcon = platformIcons[post.platform] || Instagram;
  const status = STATUSES.find(s => s.value === post.status);

  return (
    <div className="space-y-8 animate-fade-in" data-testid="post-detail-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/ideas">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className={cn("status-" + post.status, "border-0")}>
                {status?.label}
              </Badge>
              <span className="text-xs text-zinc-500 font-mono">
                Created {formatDate(post.created_at)}
              </span>
            </div>
            <h1 className="text-2xl font-bold">{post.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-900 border-white/10">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400">
                  This action cannot be undone. This will permanently delete your content idea.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-white/10">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="bg-lime-400 text-black hover:bg-lime-500"
            data-testid="save-post-btn"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Editor */}
        <div className="lg:col-span-8 space-y-6">
          {/* Basic Info */}
          <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-semibold mb-4">Content Details</h2>
            
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={post.title}
                onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
                className="bg-zinc-950/50 border-white/10 focus:border-lime-400/50"
                data-testid="edit-title-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description / Hook</Label>
              <Textarea
                id="description"
                value={post.description || ''}
                onChange={(e) => setPost(prev => ({ ...prev, description: e.target.value }))}
                className="bg-zinc-950/50 border-white/10 focus:border-lime-400/50 resize-none"
                rows={3}
                placeholder="What's the hook for this content?"
                data-testid="edit-description-input"
              />
            </div>
          </div>

          {/* Script Editor */}
          <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Script</h2>
              <div className="flex items-center gap-2">
                <Switch
                  checked={post.script_final}
                  onCheckedChange={(checked) => setPost(prev => ({ ...prev, script_final: checked }))}
                  data-testid="script-final-switch"
                />
                <Label className="text-sm text-zinc-400">Mark as Final</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hook">Hook (Opening)</Label>
              <Textarea
                id="hook"
                value={post.hook || ''}
                onChange={(e) => setPost(prev => ({ ...prev, hook: e.target.value }))}
                className="bg-zinc-950/50 border-white/10 focus:border-lime-400/50 resize-none"
                rows={2}
                placeholder="The attention-grabbing opening..."
                data-testid="edit-hook-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="script">Main Script</Label>
              <Textarea
                id="script"
                value={post.script || ''}
                onChange={(e) => setPost(prev => ({ ...prev, script: e.target.value }))}
                className="bg-zinc-950/50 border-white/10 focus:border-lime-400/50 resize-none font-mono text-sm"
                rows={10}
                placeholder="Write your full script here..."
                data-testid="edit-script-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cta">Call to Action</Label>
              <Textarea
                id="cta"
                value={post.cta || ''}
                onChange={(e) => setPost(prev => ({ ...prev, cta: e.target.value }))}
                className="bg-zinc-950/50 border-white/10 focus:border-lime-400/50 resize-none"
                rows={2}
                placeholder="What action do you want viewers to take?"
                data-testid="edit-cta-input"
              />
            </div>
          </div>

          {/* Caption & Hashtags */}
          <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-semibold">Caption & Hashtags</h2>

            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                value={post.caption || ''}
                onChange={(e) => setPost(prev => ({ ...prev, caption: e.target.value }))}
                className="bg-zinc-950/50 border-white/10 focus:border-lime-400/50 resize-none"
                rows={4}
                placeholder="Write your post caption..."
                data-testid="edit-caption-input"
              />
            </div>

            <div className="space-y-2">
              <Label>Hashtags</Label>
              <div className="flex gap-2">
                <Input
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
                  placeholder="#hashtag"
                  className="bg-zinc-950/50 border-white/10 focus:border-lime-400/50"
                  data-testid="hashtag-input"
                />
                <Button type="button" variant="outline" onClick={addHashtag} className="border-white/10">
                  Add
                </Button>
              </div>
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.hashtags.map((hashtag) => (
                    <span
                      key={hashtag}
                      className="inline-flex items-center gap-1 text-xs font-mono px-2 py-1 bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 rounded"
                    >
                      {hashtag}
                      <button onClick={() => removeHashtag(hashtag)} className="hover:text-white">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Meta */}
          <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-semibold">Settings</h2>

            <div className="space-y-2">
              <Label>Platform</Label>
              <Select
                value={post.platform}
                onValueChange={(value) => setPost(prev => ({ ...prev, platform: value }))}
              >
                <SelectTrigger className="bg-zinc-950/50 border-white/10">
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
                value={post.content_type}
                onValueChange={(value) => setPost(prev => ({ ...prev, content_type: value }))}
              >
                <SelectTrigger className="bg-zinc-950/50 border-white/10">
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

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={post.status}
                onValueChange={(value) => setPost(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="bg-zinc-950/50 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10">
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      <span style={{ color: s.color }}>{s.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={post.priority}
                onValueChange={(value) => setPost(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger className="bg-zinc-950/50 border-white/10">
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

            <div className="space-y-2">
              <Label htmlFor="scheduled">Scheduled Date</Label>
              <Input
                id="scheduled"
                type="date"
                value={post.scheduled_at ? post.scheduled_at.split('T')[0] : ''}
                onChange={(e) => setPost(prev => ({ 
                  ...prev, 
                  scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : null 
                }))}
                className="bg-zinc-950/50 border-white/10 focus:border-lime-400/50"
                data-testid="scheduled-date-input"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-semibold">Tags</h2>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag..."
                className="bg-zinc-950/50 border-white/10 focus:border-lime-400/50"
                data-testid="edit-tag-input"
              />
              <Button type="button" variant="outline" onClick={addTag} className="border-white/10">
                Add
              </Button>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs font-mono px-2 py-1 bg-lime-400/10 text-lime-400 border border-lime-400/20 rounded"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Post-Production Checklist */}
          <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Post-Production</h2>
            
            {[
              { key: 'thumbnail_done', label: 'Thumbnail Done' },
              { key: 'captions_finalized', label: 'Captions Finalized' },
              { key: 'hashtags_added', label: 'Hashtags Added' },
              { key: 'exported', label: 'Exported' },
              { key: 'uploaded', label: 'Uploaded' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <Label className="text-sm text-zinc-400">{item.label}</Label>
                <Switch
                  checked={post[item.key]}
                  onCheckedChange={(checked) => setPost(prev => ({ ...prev, [item.key]: checked }))}
                  data-testid={`${item.key}-switch`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
