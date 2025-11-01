import { MetaPreviewer } from '@/components/meta-previewer';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-20">
          <h1 className="text-5xl sm:text-6xl font-light tracking-tight text-black dark:text-white mb-4">
            OG Meta Previewer
          </h1>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 font-light max-w-2xl">
            Preview how your URLs appear across social platforms
          </p>
        </header>

        <main>
          <MetaPreviewer />
        </main>
      </div>
    </div>
  );
}
