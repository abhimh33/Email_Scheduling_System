import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Header } from "../components/Header";
import { Tabs } from "../components/Tabs";
import { EmailTable } from "../components/EmailTable";
import { EmptyState } from "../components/EmptyState";
import { LoadingState } from "../components/LoadingState";
import { ComposeForm } from "../components/ComposeForm";
import { SearchBar } from "../components/SearchBar";
import { ToastContainer, useToast } from "../components/Toast";
import { useEmails } from "../hooks/useEmails";
import { cancelEmail, duplicateEmail, searchEmails } from "../services/emailService";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<"scheduled" | "sent">("scheduled");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof scheduled | null>(null);
  const idToken = (session as typeof session & { idToken?: string })?.idToken;
  const { scheduled, sent, loading, refresh } = useEmails(idToken);
  const toast = useToast();

  const activeEmails = useMemo(() => {
    if (searchResults) return searchResults;
    return tab === "scheduled" ? scheduled : sent;
  }, [tab, scheduled, sent, searchResults]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchResults(null);
      return;
    }
    if (!idToken) return;
    try {
      const result = await searchEmails(query, tab, idToken);
      setSearchResults(result.emails);
    } catch {
      toast.error("Search failed");
    }
  };

  const handleCancel = async (emailId: string) => {
    if (!idToken) return;
    try {
      await cancelEmail(emailId, idToken);
      toast.success("Email cancelled successfully");
      refresh();
    } catch {
      toast.error("Failed to cancel email");
    }
  };

  const handleDuplicate = async (emailId: string) => {
    if (!idToken) return;
    try {
      const scheduledAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour from now
      await duplicateEmail(emailId, scheduledAt, idToken);
      toast.success("Email duplicated and scheduled for 1 hour from now");
      refresh();
    } catch {
      toast.error("Failed to duplicate email");
    }
  };

  const handleScheduled = () => {
    toast.success("Emails scheduled successfully!");
    refresh();
  };

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
      
      <Header name={session.user?.name} email={session.user?.email} image={session.user?.image} />
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <ComposeForm idToken={idToken} onScheduled={handleScheduled} />
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Email Activity
            </h2>
            <p className="text-sm text-slate-400 mt-1">Track your scheduled and sent emails</p>
          </div>
          <Tabs value={tab} onChange={(newTab) => { setTab(newTab); setSearchResults(null); setSearchQuery(""); }} />
        </div>

        <div className="max-w-md">
          <SearchBar onSearch={handleSearch} placeholder={`Search ${tab} emails...`} />
        </div>
        
        {loading ? (
          <LoadingState />
        ) : activeEmails.length === 0 ? (
          <EmptyState
            title={searchQuery ? "No results found" : "No emails yet"}
            subtitle={searchQuery ? "Try a different search term." : "Schedule emails to see them appear here. Use the compose form above to get started."}
          />
        ) : (
          <EmailTable 
            emails={activeEmails} 
            onCancel={tab === "scheduled" ? handleCancel : undefined}
            onDuplicate={handleDuplicate}
          />
        )}
      </main>

      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </div>
  );
}
