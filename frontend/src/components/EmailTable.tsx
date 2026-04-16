import { Email } from "../types/email";

type EmailTableProps = {
  emails: Email[];
  onCancel?: (emailId: string) => void;
  onDuplicate?: (emailId: string) => void;
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case "sent":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    case "scheduled":
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    case "failed":
      return "bg-red-500/10 text-red-400 border border-red-500/20";
    default:
      return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "sent":
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    case "scheduled":
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "failed":
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    default:
      return null;
  }
};

export const EmailTable = ({ emails, onCancel, onDuplicate }: EmailTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/5 border-b border-white/10">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Recipient
              </span>
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Subject
              </span>
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Scheduled
              </span>
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Status
              </span>
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {emails.map((email, index) => (
            <tr 
              key={email.id} 
              className="transition-colors hover:bg-white/5 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                    {email.recipient.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-200 font-medium group-hover:text-white transition-colors">
                    {email.recipient}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-slate-300 group-hover:text-slate-100 transition-colors">
                  {email.subject}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-slate-400 text-sm">
                  {new Date(email.scheduledAt).toLocaleString()}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyles(email.status)}`}>
                  {getStatusIcon(email.status)}
                  {email.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {email.status === "scheduled" && onCancel && (
                    <button
                      onClick={() => onCancel(email.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Cancel email"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {onDuplicate && (
                    <button
                      onClick={() => onDuplicate(email.id)}
                      className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                      title="Duplicate email"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
