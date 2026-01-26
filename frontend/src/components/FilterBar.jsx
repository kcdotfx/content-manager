import { Search, X, Filter } from 'lucide-react';
import { cn, PLATFORMS, CONTENT_TYPES, STATUSES, PRIORITIES } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function FilterBar({ filters, setFilters }) {
  const hasActiveFilters = filters.platform || filters.status || filters.content_type || filters.priority || filters.search;

  const clearFilters = () => {
    setFilters({
      platform: '',
      status: '',
      content_type: '',
      priority: '',
      search: '',
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3" data-testid="filter-bar">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          placeholder="Search ideas..."
          className="pl-10 bg-zinc-950/50 border-white/10 focus:border-lime-400/50"
          data-testid="search-input"
        />
      </div>

      {/* Platform Filter */}
      <Select
        value={filters.platform}
        onValueChange={(value) => setFilters(prev => ({ ...prev, platform: value === 'all' ? '' : value }))}
      >
        <SelectTrigger className="w-[140px] bg-zinc-950/50 border-white/10" data-testid="filter-platform">
          <SelectValue placeholder="Platform" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-white/10">
          <SelectItem value="all">All Platforms</SelectItem>
          {PLATFORMS.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select
        value={filters.status}
        onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === 'all' ? '' : value }))}
      >
        <SelectTrigger className="w-[130px] bg-zinc-950/50 border-white/10" data-testid="filter-status">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-white/10">
          <SelectItem value="all">All Status</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Content Type Filter */}
      <Select
        value={filters.content_type}
        onValueChange={(value) => setFilters(prev => ({ ...prev, content_type: value === 'all' ? '' : value }))}
      >
        <SelectTrigger className="w-[130px] bg-zinc-950/50 border-white/10" data-testid="filter-content-type">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-white/10">
          <SelectItem value="all">All Types</SelectItem>
          {CONTENT_TYPES.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Priority Filter */}
      <Select
        value={filters.priority}
        onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value === 'all' ? '' : value }))}
      >
        <SelectTrigger className="w-[130px] bg-zinc-950/50 border-white/10" data-testid="filter-priority">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-white/10">
          <SelectItem value="all">All Priority</SelectItem>
          {PRIORITIES.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-zinc-400 hover:text-white"
          data-testid="clear-filters-btn"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
