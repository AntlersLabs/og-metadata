import { MetaData } from '@/lib/types';

interface LinkedInPreviewProps {
  metaData: MetaData;
}

export function LinkedInPreview({ metaData }: LinkedInPreviewProps) {
  const title = metaData.og.title || metaData.title || 'No title';
  const description = metaData.og.description || metaData.description || 'No description';
  const image = metaData.og.image || '';
  const domain = metaData.og.url ? new URL(metaData.og.url).hostname : 'example.com';

  return (
    <div className="overflow-hidden border border-neutral-200 dark:border-neutral-800 max-w-[552px] bg-white dark:bg-neutral-900">
      {image && (
        <div className="w-full aspect-[1.91/1] bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
          <img
            src={image}
            alt={metaData.og.imageAlt || title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="p-4 bg-white dark:bg-neutral-900">
        <div className="text-sm font-medium text-black dark:text-white line-clamp-2 mb-1.5">
          {title}
        </div>
        <div className="text-xs text-neutral-400 line-clamp-1 font-light">
          {domain}
        </div>
      </div>
    </div>
  );
}
