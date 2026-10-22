"use client";

import React from "react";
import { ChatInterface } from "@/components/chat/chat-interface";
import { PageHeader } from "@/components/shared/states";

export default function SuperadminChatPage() {
  return (
    <div className="flex h-[calc(100dvh-8.5rem)] flex-col lg:h-[calc(100dvh-10rem)]">
      <PageHeader
        title="Support inbox"
        subtitle="Compliance requests and customer tickets."
      />
      <div className="min-h-0 flex-1">
        <ChatInterface role="admin" />
      </div>
    </div>
  );
}
