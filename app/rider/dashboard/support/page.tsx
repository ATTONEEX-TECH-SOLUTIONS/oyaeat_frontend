"use client";

import { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, Bell, Send, ShieldAlert, 
  HelpCircle, Clock, CheckCircle2, User, Loader2 
} from "lucide-react";

export default function SupportAndNotificationsView() {
  const [activeTab, setActiveTab] = useState<"support" | "alerts">("support");
  const [threads, setThreads] = useState<any[]>([]);
  const [activeThread, setActiveThread] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fallback local notifications log array list
  const mockAlerts = [
    { title: "Payout Dispatched", desc: "₦14,200 shifted to bank processing stream cleanly.", time: "2 hours ago", type: "success" },
    { title: "Compliance Warning", desc: "Ensure your vehicle registration plate data remains clear.", time: "1 day ago", type: "warning" },
  ];

  const fetchChatData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const token = localStorage.getItem("riderToken");
      const res = await fetch(`${API_BASE_URL}/api/rider/support/threads`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const payload = await res.json();
        setThreads(payload.threads || []);
        if (activeThread) {
          const freshActive = payload.threads.find((t: any) => t.id === activeThread.id);
          if (freshActive) setActiveThread(freshActive);
        } else if (payload.threads.length > 0) {
          setActiveThread(payload.threads[0]);
        }
      }
    } catch (err) {
      console.error("Support fetch err", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatData();
    const chatPollLoop = setInterval(() => fetchChatData(true), 8000);
    return () => clearInterval(chatPollLoop);
  }, [activeThread?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;
    setSending(true);
    try {
      const token = localStorage.getItem("riderToken");
      const response = await fetch(`${API_BASE_URL}/rider/support/message`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ threadId: activeThread.id, content: replyText })
      });
      if (response.ok) {
        setReplyText("");
        await fetchChatData(true);
      }
    } catch (err) {
      console.error("Message send failure", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold"><Loader2 className="w-6 h-6 animate-spin mx-auto text-green-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[650px]">
      
      {/* Navigation Matrix Head Selector */}
      <div className="flex border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
        <button
          onClick={() => setActiveTab("support")}
          className={`flex-1 py-4 text-sm font-bold border-b-2 flex items-center justify-center gap-2 transition-all ${
            activeTab === "support" ? "border-green-600 text-green-600 bg-white" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Live Support Chat
        </button>
        <button
          onClick={() => setActiveTab("alerts")}
          className={`flex-1 py-4 text-sm font-bold border-b-2 flex items-center justify-center gap-2 transition-all ${
            activeTab === "alerts" ? "border-green-600 text-green-600 bg-white" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Bell className="w-4 h-4" /> Operations Alerts ({mockAlerts.length})
        </button>
      </div>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {activeTab === "support" ? (
          <>
            {/* Sidebar Tickets List Column */}
            <div className="w-full md:w-64 border-r border-gray-100 flex flex-col bg-gray-50/30 overflow-y-auto">
              {threads.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setActiveThread(t)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    activeThread?.id === t.id ? "bg-green-50/30 border-l-4 border-l-green-600" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-gray-900 text-xs truncate max-w-[120px]">{t.subject}</h4>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase bg-gray-200 text-gray-700">{t.status}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate mt-1">{t.lastMessage || "No messages yet."}</p>
                </div>
              ))}
            </div>

            {/* Chat Frame Messaging Interface Window */}
            <div className="flex-1 flex flex-col bg-white">
              {activeThread ? (
                <>
                  <div className="p-4 border-b border-gray-100 bg-white flex items-center gap-2 flex-shrink-0">
                    <HelpCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-black text-gray-900">{activeThread.subject}</span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {activeThread.messages?.map((msg: any) => {
                      const isMe = msg.senderRole === "rider";
                      return (
                        <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                            isMe ? "bg-green-700 text-white rounded-tr-none" : "bg-gray-100 text-gray-900 rounded-tl-none"
                          }`}>
                            <p className="font-semibold mb-1 text-[10px] opacity-75">{isMe ? "You" : "OyaEat Support"}</p>
                            <p>{msg.content}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>

                  <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 flex gap-2 flex-shrink-0 bg-white">
                    <input
                      type="text"
                      placeholder="Type your reply message..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 text-xs focus:outline-none focus:border-green-600 text-gray-900"
                    />
                    <button type="submit" disabled={sending || !replyText.trim()} className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl transition-all disabled:opacity-40">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-xs">Select a support ticket to review message loops.</div>
              )}
            </div>
          </>
        ) : (
          /* System Notifications Logs Layer View */
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {mockAlerts.map((alert, idx) => (
              <div key={idx} className={`p-4 rounded-xl border flex items-start gap-3 bg-white ${
                alert.type === "warning" ? "border-red-200 bg-red-50/10" : "border-green-200 bg-green-50/10"
              }`}>
                {alert.type === "warning" ? <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />}
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-gray-900">{alert.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{alert.desc}</p>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
