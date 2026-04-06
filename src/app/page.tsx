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

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (query) params.set('q', query);
      if (selectedTypes.length > 0) params.set('types', selectedTypes.join(','));
      if (dateRange) params.set('days', dateRange);

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
  }, [page, query, selectedTypes, dateRange]);

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
