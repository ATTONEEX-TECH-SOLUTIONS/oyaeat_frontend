"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Bell, Loader2 } from "lucide-react";
import { chatApi, type Thread, type Message } from "@/lib/api/chat";
import { RiderChatSidebar } from "../components/support/RiderChatSidebar";
import { RiderChatWindow } from "../components/support/RiderChatWindow";
import { RiderAlertsView } from "../components/support/RiderAlertsView";



export default function SupportAndNotificationsView() {
  const [activeTab, setActiveTab] = useState<"support" | "alerts">("support");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  // 🚀 LIVE STATE: Stores raw alert objects fetched from your database
  const [alerts, setAlerts] = useState<any[]>([]);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const [isCreating, setIsCreating] = useState(false);
  const [newSubject, setNewSubject] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

    const fetchRiderData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const token = localStorage.getItem("rider_token") || 
                    localStorage.getItem("riderToken") || 
                    localStorage.getItem("authToken");

      // 🚀 FIXED: Fallback native fetch completely bypasses the chatApi object property blockage
      const [threadsRes, alertsRes] = await Promise.all([
        chatApi.getThreads("rider"),
        fetch(`${API_BASE_URL}/chat/operations-alerts`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }).then(res => res.json())
      ]);

      const threadData = threadsRes.data || [];
      setThreads(threadData);
      
      if (alertsRes && alertsRes.success) {
        setAlerts(alertsRes.data || []);
      }
      
      if (!activeThreadId && threadData.length > 0) {
        setActiveThreadId(threadData[0].id);
      }
    } catch (err) {
      console.error("Rider workspace data sync error:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };



  const fetchRiderMessages = async (threadId: string) => {
    setLoadingMessages(true);
    try {
      const res = await chatApi.getMessages("rider", threadId);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Support messages fetch error:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchRiderData();
    // ⏳ BACKGROUND POLLING LOOP: Refreshes chats and alerts silently every 15 seconds
    const backgroundPoll = setInterval(() => fetchRiderData(true), 15000);
    return () => clearInterval(backgroundPoll);
  }, []);

  useEffect(() => {
    if (activeThreadId) {
      fetchRiderMessages(activeThreadId);
      const messagePoll = setInterval(() => {
        chatApi.getMessages("rider", activeThreadId).then((res) => {
          setMessages(res.data || []);
        }).catch(() => {});
      }, 5000);
      return () => clearInterval(messagePoll);
    } else {
      setMessages([]);
    }
  }, [activeThreadId]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    setSending(true);
    try {
      const res = await chatApi.createSupportThread("rider", newSubject.trim(), "support");
      setIsCreating(false);
      setNewSubject("");
      await fetchRiderData(true);
      if (res.data?.id) setActiveThreadId(res.data.id);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThreadId) return;
    setSending(true);
    try {
      await chatApi.sendMessage("rider", activeThreadId, replyText);
      setReplyText("");
      const freshRes = await chatApi.getMessages("rider", activeThreadId);
      setMessages(freshRes.data || []);
      fetchRiderData(true);
    } catch (err) {
      console.error("Message send failure:", err);
    } finally {
      setSending(false);
    }
  };

  const activeThread = threads.find(t => t.id === activeThreadId);
  // Compute unread alert count checks dynamically
  const unreadAlertsCount = alerts.length;

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 font-bold h-[400px] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[650px] w-full">
      
      {/* Navigation Tab Selection Headers */}
      <div className="flex border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("support")}
          className={`flex-1 py-4 text-sm font-bold border-b-2 flex items-center justify-center gap-2 transition-all ${
            activeTab === "support" ? "border-green-600 text-green-600 bg-white" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Live Support Chat
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("alerts")}
          className={`flex-1 py-4 text-sm font-bold border-b-2 flex items-center justify-center gap-2 transition-all ${
            activeTab === "alerts" ? "border-green-600 text-green-600 bg-white" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Bell className="w-4 h-4" /> Operations Alerts ({unreadAlertsCount})
        </button>
      </div>

      <div className="flex-1 flex min-h-0 overflow-hidden w-full">
        {activeTab === "support" ? (
          <>
            <RiderChatSidebar
              threads={threads}
              activeThreadId={activeThreadId}
              isCreating={isCreating}
              setIsCreating={setIsCreating}
              setActiveThreadId={setActiveThreadId}
            />
            <RiderChatWindow
              isCreating={isCreating}
              activeThreadId={activeThreadId}
              activeThread={activeThread}
              loadingMessages={loadingMessages}
              messages={messages}
              replyText={replyText}
              setReplyText={setReplyText}
              sending={sending}
              newSubject={newSubject}
              setNewSubject={setNewSubject}
              setIsCreating={setIsCreating}
              handleCreateTicket={handleCreateTicket}
              handleSendMessage={handleSendMessage}
              chatEndRef={chatEndRef}
            />
          </>
        ) : (
          <RiderAlertsView alerts={alerts} />
        )}
      </div>
    </div>
  );
}
