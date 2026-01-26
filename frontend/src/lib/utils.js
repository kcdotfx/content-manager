import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const PLATFORMS = [
  { value: 'instagram', label: 'Instagram', color: '#E1306C' },
  { value: 'youtube', label: 'YouTube', color: '#FF0000' },
  { value: 'linkedin', label: 'LinkedIn', color: '#0077B5' },
  { value: 'twitter', label: 'Twitter/X', color: '#1DA1F2' },
];

export const CONTENT_TYPES = [
  { value: 'reel', label: 'Reel' },
  { value: 'carousel', label: 'Carousel' },
  { value: 'static', label: 'Static' },
  { value: 'video', label: 'Video' },
  { value: 'thread', label: 'Thread' },
  { value: 'short', label: 'Short' },
];

export const STATUSES = [
  { value: 'idea', label: 'Idea', color: '#a1a1aa' },
  { value: 'scripted', label: 'Scripted', color: '#8b5cf6' },
  { value: 'shooting', label: 'Shooting', color: '#22d3ee' },
  { value: 'editing', label: 'Editing', color: '#fbbf24' },
  { value: 'review', label: 'Review', color: '#f472b6' },
  { value: 'ready', label: 'Ready', color: '#bef264' },
  { value: 'published', label: 'Published', color: '#22c55e' },
];

export const PRIORITIES = [
  { value: 'low', label: 'Low', color: '#22d3ee' },
  { value: 'medium', label: 'Medium', color: '#fbbf24' },
  { value: 'high', label: 'High', color: '#f87171' },
];

export const getPlatformIcon = (platform) => {
  switch (platform) {
    case 'instagram': return 'Instagram';
    case 'youtube': return 'Youtube';
    case 'linkedin': return 'Linkedin';
    case 'twitter': return 'Twitter';
    default: return 'Globe';
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatRelativeDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(dateString);
};
