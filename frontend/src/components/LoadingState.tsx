export const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-8 py-16">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-indigo-500 animate-spin" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-b-purple-500 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
      </div>
      <p className="mt-6 text-sm font-medium text-slate-400">Loading emails...</p>
    </div>
  );
};
