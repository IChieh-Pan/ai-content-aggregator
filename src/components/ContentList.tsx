'use client';

import { Loader2 } from 'lucide-react';
import type { ContentItem } from '@/lib/types';
import ContentCard from './ContentCard';
import Pagination from './Pagination';

interface ContentListProps {
  items: ContentItem[];
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export default function ContentList({
  items,
  total,
  page,
  pageSize,
  isLoading,
  onPageChange,
}: ContentListProps) {
  const totalPages = Math.ceil(total / pageSize);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">
          No content found
        </p>
        <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        {total} result{total !== 1 ? 's' : ''}
      </p>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
      <div className="mt-6">
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </div>
  );
}
