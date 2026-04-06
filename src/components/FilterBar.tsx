'use client';

import { FileText, BookOpen, Headphones, Video, Wrench } from 'lucide-react';
import type { ContentType } from '@/lib/types';

const contentTypes: { value: ContentType; label: string; icon: typeof FileText }[] = [
  { value: 'article', label: 'Articles', icon: FileText },
  { value: 'book', label: 'Books', icon: BookOpen },
  { value: 'podcast', label: 'Podcasts', icon: Headphones },
  { value: 'video', label: 'Videos', icon: Video },
  { value: 'tool', label: 'Tools', icon: Wrench },
];

const dateRanges = [
  { value: '', label: 'All time' },
  { value: '7', label: 'Past week' },
  { value: '30', label: 'Past month' },
  { value: '90', label: 'Past 3 months' },
];

interface FilterBarProps {
  selectedTypes: ContentType[];
  onTypesChange: (types: ContentType[]) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

export default function FilterBar({
  selectedTypes,
  onTypesChange,
  dateRange,
  onDateRangeChange,
}: FilterBarProps) {
  const toggleType = (type: ContentType) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-1.5">
        {contentTypes.map(({ value, label, icon: Icon }) => {
          const active = selectedTypes.includes(value);
          return (
            <button
              key={value}
              onClick={() => toggleType(value)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
              }`}
            >
              <Icon className="h-3 w-3" />
              {label}
            </button>
          );
        })}
      </div>
      <select
        value={dateRange}
        onChange={(e) => onDateRangeChange(e.target.value)}
        className="h-8 rounded-lg border border-zinc-200 bg-white px-3 text-xs text-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
      >
        {dateRanges.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
