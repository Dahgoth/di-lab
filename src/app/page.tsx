export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          DI-Lab
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 mb-8">
          Optimize your legendary gems in Diablo Immortal. Get AI-powered
          upgrade recommendations to maximize your build efficiency.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/optimize"
            className="px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
          >
            Start Optimizing
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
