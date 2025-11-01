import { MetaData } from '@/lib/types';
import Image from 'next/image';

interface FacebookPreviewProps {
  metaData: MetaData;
}

export function FacebookPreview({ metaData }: FacebookPreviewProps) {
  const title = metaData.og.title || metaData.title || 'No title';
  const description = metaData.og.description || metaData.description || 'No description';
  const image = metaData.og.image || '';
  const siteName = metaData.og.siteName || new URL(metaData.og.url || 'https://example.com').hostname;

  return (
    <div className="overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 max-w-[500px]">
      {image && (
        <div className="w-full aspect-[1.91/1] bg-neutral-100 dark:bg-neutral-800 overflow-hidden relative">
          <Image
            src={image}
            alt={metaData.og.imageAlt || title}
            fill
            unoptimized
            className="object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800">
        <div className="text-xs text-neutral-400 uppercase mb-2 tracking-wider font-light">
          {siteName}
        </div>
        <div className="text-base font-medium text-black dark:text-white line-clamp-2 mb-1.5">
          {title}
        </div>
        <div className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 font-light">
          {description}
        </div>
      </div>
    </div>
  );
}
