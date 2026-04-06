'use client';

import { formatDistanceToNow } from 'date-fns';
import { BookOpen, Headphones, Video, Wrench, FileText } from 'lucide-react';
import type { ContentItem, ContentType } from '@/lib/types';

const typeConfig: Record<ContentType, { icon: typeof FileText; label: string; color: string }> = {
  article: { icon: FileText, label: 'Article', color: 'bg-blue-100 text-blue-700' },
  book: { icon: BookOpen, label: 'Book', color: 'bg-purple-100 text-purple-700' },
  podcast: { icon: Headphones, label: 'Podcast', color: 'bg-green-100 text-green-700' },
  video: { icon: Video, label: 'Video', color: 'bg-red-100 text-red-700' },
  tool: { icon: Wrench, label: 'Tool', color: 'bg-amber-100 text-amber-700' },
};

export default function ContentCard({ item }: { item: ContentItem }) {
  const config = typeConfig[item.contentType];
  const Icon = config.icon;

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-lg border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-snug text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
            {item.title}
          </h3>
          {item.description && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {item.description}
            </p>
          )}
        </div>
        {item.qualityScore !== null && (
          <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {Math.round(item.qualityScore * 100)}%
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
          <Icon className="h-3 w-3" />
          {config.label}
        </span>
        {item.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          >
            {tag}
          </span>
        ))}
        <span className="ml-auto text-xs text-zinc-400 dark:text-zinc-500">
          {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
        </span>
      </div>
    </a>
  );
}
