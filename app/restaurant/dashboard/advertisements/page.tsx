"use client";

import { useState, useEffect } from "react";
import { CreateBannerForm } from "@/app/superadmin/dashboard/components/create-banner-form";
import { ActiveBroadcastsTable } from "@/app/superadmin/dashboard/components/active-broadcasts-table";

export default function RestaurantAdvertPage() {
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [targetBusinessId, setTargetBusinessId] = useState<string>("vendor_session"); 
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [durationHours, setDurationHours] = useState<string>("24");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    async function initPage() {
      setLoading(true);
      setErrorMsg(null);
      await fetchMyActiveBroadcasts();
      setLoading(false);
    }
    initPage();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const getAuthToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("vendor_token") || localStorage.getItem("authToken");
  };

  const fetchMyActiveBroadcasts = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/vendor/broadcasts/my-active`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (json.success) {
        setBroadcasts(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load your promotions list:", err);
    }
  };

  const handleCreateBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!title || !desc || !selectedFile) {
      setErrorMsg("Please fill out all fields and choose a campaign broadcast image.");
      return;
    }

    setSubmitting(true);
    try {
      const token = getAuthToken();
      const payload = new FormData();
      payload.append("businessId", "0"); 
      payload.append("title", title);
      payload.append("desc", desc);
      payload.append("durationHours", durationHours);
      payload.append("image", selectedFile);

      const response = await fetch(`${API_BASE_URL}/vendor/broadcasts/request-approval`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      const resData = await response.json();

      if (response.ok) {
        setSuccessMsg(resData.message || "Campaign sent to administration teams for live review approval.");
        setTitle("");
        setDesc("");
        setSelectedFile(null);
        setPreviewUrl(null);
        fetchMyActiveBroadcasts();
      } else {
        setErrorMsg(resData.message || "Failed to submit marketing draft.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred during form transmission.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActiveStatus = async (id: number, currentStatus: boolean) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const token = getAuthToken();
      if (!token) return;

      const nextStatusState = !currentStatus;

      const res = await fetch(`${API_BASE_URL}/vendor/broadcasts/${id}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: nextStatusState }),
      });

      const resData = await res.json();

      if (res.ok) {
        setSuccessMsg(resData.message || "Broadcast preference updated successfully.");
        setBroadcasts((prev) =>
          prev.map((item) => (item.id === id ? { ...item, isActive: nextStatusState } : item))
        );
      } else {
        setErrorMsg(resData.message || "Unable to adjust broadcast preference flag.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Status update transmission network failure.");
    }
  };

  return (
    <div className="p-4 md:p-6 w-full flex flex-col justify-start items-start gap-6">
      <div className="border-b pb-4 border-slate-100 w-full max-w-7xl">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Marketing Campaign Desks</h1>
        <p className="text-xs text-slate-500 mt-1">Submit visual broadcast promotional assets up for review approval.</p>
      </div>

      {(successMsg || errorMsg) && (
        <div className="w-full max-w-7xl space-y-2">
          {successMsg && <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold shadow-sm">{successMsg}</div>}
          {errorMsg && <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold shadow-sm">{errorMsg}</div>}
        </div>
      )}

      {loading ? (
        <div className="w-full text-center py-20 text-xs font-bold text-slate-400 border border-dashed rounded-3xl animate-pulse">
          Synchronizing secure merchant broadcast matrices...
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-2 w-full max-w-7xl">
<CreateBannerForm
  onSubmit={handleCreateBroadcast}
  targetBusinessId={targetBusinessId}
  setTargetBusinessId={setTargetBusinessId}
  approvedBusinesses={[{ id: "vendor_session", name: "Your Restaurant Location" }]}
  title={title}
  setTitle={setTitle}
  desc={desc}
  setDesc={setDesc}
  durationHours={durationHours}
  setDurationHours={setDurationHours}
  previewUrl={previewUrl}
  selectedFile={selectedFile}
  onFileChange={handleFileChange}
  submitting={submitting}
  
  // 🚀 NEW PROP INJECTIONS ADDED HERE:
  code={code}
  setCode={setCode}
  discount={discount}
  setDiscount={setDiscount}
/>

        <ActiveBroadcastsTable
  broadcasts={broadcasts} 
/>
        </div>
      )}
    </div>
  );
}
