export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Welcome to Next.js
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 mb-8">
          A minimal Next.js starter template with TypeScript, Tailwind CSS 4, and Bun.
          Ready for AI-assisted development.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://nextjs.org/docs"
            className="px-6 py-3 bg-white text-neutral-900 font-semibold rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Read the Docs
          </a>
          <a
            href="https://github.com/Dahgoth/di-lab"
            className="px-6 py-3 bg-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-700 transition-colors border border-neutral-700"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
