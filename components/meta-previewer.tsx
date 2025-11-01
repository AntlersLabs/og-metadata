'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MetaData } from '@/lib/types';
import { FacebookPreview } from './facebook-preview';
import { TwitterPreview } from './twitter-preview';
import { LinkedInPreview } from './linkedin-preview';

export function MetaPreviewer() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [metaData, setMetaData] = useState<MetaData | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('facebook');

  const fetchMetaData = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    setMetaData(null);

    try {
      const response = await fetch('/api/meta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch meta data');
      }

      setMetaData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMetaData();
  };

  return (
    <div className="w-full space-y-16">
      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="flex gap-3">
          <Input
            id="url"
            type="url"
            placeholder="Enter URL to analyze"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-12 text-base bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white"
          />
          <Button
            type="submit"
            disabled={loading}
            className="h-12 px-8 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
        {error && (
          <p className="text-sm text-red-500 mt-3">{error}</p>
        )}
      </form>

      {metaData && (
        <div className="space-y-16">
          <section>
            <div className="flex items-center gap-6 mb-8 border-b border-neutral-200 dark:border-neutral-800">
              {['facebook', 'twitter', 'linkedin'].map((platform) => (
                <button
                  key={platform}
                  onClick={() => setActiveTab(platform)}
                  className={`pb-3 text-sm font-light capitalize transition-colors relative ${
                    activeTab === platform
                      ? 'text-black dark:text-white'
                      : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                  }`}
                >
                  {platform}
                  {activeTab === platform && (
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-black dark:bg-white" />
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[300px]">
              {activeTab === 'facebook' && <FacebookPreview metaData={metaData} />}
              {activeTab === 'twitter' && <TwitterPreview metaData={metaData} />}
              {activeTab === 'linkedin' && <LinkedInPreview metaData={metaData} />}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-light text-neutral-400 mb-8 uppercase tracking-widest">
              Meta Data
            </h2>
            <div className="space-y-8">
              <MetaSection title="Open Graph">
                <MetaItem label="Title" value={metaData.og.title} />
                <MetaItem label="Description" value={metaData.og.description} />
                <MetaItem label="Type" value={metaData.og.type} />
                <MetaItem label="URL" value={metaData.og.url} />
                <MetaItem label="Image" value={metaData.og.image} isUrl />
                <MetaItem label="Image Alt" value={metaData.og.imageAlt} />
                <MetaItem label="Image Width" value={metaData.og.imageWidth} />
                <MetaItem label="Image Height" value={metaData.og.imageHeight} />
                <MetaItem label="Site Name" value={metaData.og.siteName} />
                <MetaItem label="Locale" value={metaData.og.locale} />
              </MetaSection>

              <MetaSection title="Twitter Card">
                <MetaItem label="Card Type" value={metaData.twitter.card} />
                <MetaItem label="Site" value={metaData.twitter.site} />
                <MetaItem label="Creator" value={metaData.twitter.creator} />
                <MetaItem label="Title" value={metaData.twitter.title} />
                <MetaItem label="Description" value={metaData.twitter.description} />
                <MetaItem label="Image" value={metaData.twitter.image} isUrl />
                <MetaItem label="Image Alt" value={metaData.twitter.imageAlt} />
              </MetaSection>

              <MetaSection title="Basic Meta">
                <MetaItem label="Title" value={metaData.title} />
                <MetaItem label="Description" value={metaData.description} />
                <MetaItem label="Author" value={metaData.author} />
                <MetaItem label="Keywords" value={metaData.keywords} />
                <MetaItem label="Canonical URL" value={metaData.canonical} isUrl />
                <MetaItem label="Robots" value={metaData.robots} />
                <MetaItem label="Favicon" value={metaData.favicon} isUrl />
              </MetaSection>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function MetaSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6">
      <h3 className="text-xs font-light tracking-widest uppercase mb-6 text-neutral-400">
        {title}
      </h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function MetaItem({ label, value, isUrl = false }: { label: string; value: string; isUrl?: boolean }) {
  if (!value) return null;

  return (
    <div className="grid grid-cols-[160px_1fr] gap-6 text-sm pb-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0 last:pb-0">
      <div className="font-light text-neutral-400">
        {label}
      </div>
      <div className="text-black dark:text-white break-words font-mono text-xs">
        {isUrl && value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </div>
    </div>
  );
}
