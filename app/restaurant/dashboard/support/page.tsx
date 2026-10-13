"use client";

import React from "react";
import { ChatInterface } from "@/components/chat/chat-interface";
import { PageHeader } from "@/components/shared/states";

export default function VendorSupportPage() {
  return (
    <div className="mx-auto flex h-[calc(100dvh-13rem)] max-w-4xl flex-col lg:h-[calc(100dvh-9.5rem)]">
      <PageHeader title="Support" subtitle="Chat with the OyaEat team." />
      <div className="min-h-0 flex-1">
        <ChatInterface role="vendor" />
      </div>
    </div>
  );
}
