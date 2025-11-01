import { MetaData } from '@/lib/types';

interface TwitterPreviewProps {
  metaData: MetaData;
}

export function TwitterPreview({ metaData }: TwitterPreviewProps) {
  const title = metaData.twitter.title || metaData.og.title || metaData.title || 'No title';
  const description = metaData.twitter.description || metaData.og.description || metaData.description || 'No description';
  const image = metaData.twitter.image || metaData.og.image || '';
  const cardType = metaData.twitter.card || 'summary_large_image';
  const domain = metaData.og.url ? new URL(metaData.og.url).hostname : 'example.com';

  const isSummaryCard = cardType === 'summary';

  return (
    <div className="overflow-hidden border border-neutral-200 dark:border-neutral-800 max-w-[504px] bg-white dark:bg-neutral-900">
      <div className={`flex ${isSummaryCard ? 'flex-row' : 'flex-col'}`}>
        {image && (
          <div className={`bg-neutral-100 dark:bg-neutral-800 overflow-hidden ${
            isSummaryCard ? 'w-[125px] h-[125px] flex-shrink-0' : 'w-full aspect-[2/1]'
          }`}>
            <img
              src={image}
              alt={metaData.twitter.imageAlt || title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className={`p-4 ${isSummaryCard ? 'flex-1' : ''}`}>
          <div className="text-xs text-neutral-400 mb-2 font-light">
            {domain}
          </div>
          <div className="text-[15px] font-medium text-black dark:text-white line-clamp-1 mb-1">
            {title}
          </div>
          <div className="text-[15px] text-neutral-600 dark:text-neutral-400 line-clamp-2 font-light">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}
