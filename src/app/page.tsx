'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ContentItem, ContentType } from '@/lib/types';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import ContentList from '@/components/ContentList';

const PAGE_SIZE = 12;

export default function Home() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<ContentType[]>([]);
  const [dateRange, setDateRange] = useState('');
  const [isAICurating, setIsAICurating] = useState(false);
  const [useAI, setUseAI] = useState(false);

  const fetchContent = useCallback(async (aiMode = useAI) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (query) params.set('q', query);
      if (selectedTypes.length > 0) params.set('types', selectedTypes.join(','));
      if (dateRange) params.set('days', dateRange);
      if (aiMode) params.set('ai', 'true');

      const res = await fetch(`/api/content?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setItems(data.items);
      setTotal(data.total);
    } catch {
      setItems([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, query, selectedTypes, dateRange, useAI]);

  const handleAICurate = async () => {
    setIsAICurating(true);
    setUseAI(true);
    setPage(1);
    try {
      await fetchContent(true);
    } finally {
      setIsAICurating(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setPage(1);
  }, []);

  const handleTypesChange = useCallback((types: ContentType[]) => {
    setSelectedTypes(types);
    setPage(1);
  }, []);

  const handleDateRangeChange = useCallback((range: string) => {
    setDateRange(range);
    setPage(1);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Discover AI Content
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Curated articles, tools, and resources about AI for UX designers
        </p>
      </div>

      {/* AI Curate Button */}
      <div className="mb-6 flex justify-center">
        <button
          onClick={handleAICurate}
          disabled={isAICurating}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isAICurating ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              AI Curating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              🤖 Get AI-Curated Content
            </>
          )}
        </button>
      </div>

      {useAI && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            ✨ Showing AI-curated content from Gemini. Fresh topics about AI+UX selected just for you!
            <span className="block mt-1 text-xs opacity-75">
              💡 Click titles to search for these articles on the recommended publications
            </span>
          </p>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4">
        <SearchBar value={query} onChange={handleSearch} />
        <FilterBar
          selectedTypes={selectedTypes}
          onTypesChange={handleTypesChange}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
        />
      </div>

      <ContentList
        items={items}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        onPageChange={setPage}
      />
    </div>
  );
}
