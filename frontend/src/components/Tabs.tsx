type Tab = "scheduled" | "sent";

type TabsProps = {
  value: Tab;
  onChange: (value: Tab) => void;
};

export const Tabs = ({ value, onChange }: TabsProps) => {
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
      {(["scheduled", "sent"] as Tab[]).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`relative px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            value === tab
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <span className="flex items-center gap-2">
            {tab === "scheduled" ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span className="capitalize">{tab}</span>
          </span>
        </button>
      ))}
    </div>
  );
};
