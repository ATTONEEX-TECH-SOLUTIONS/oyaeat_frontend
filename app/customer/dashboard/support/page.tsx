"use client";

import React from "react";
import { ChatInterface } from "@/components/chat/chat-interface";
import { PageHeader } from "@/components/customer/ui";

export default function CustomerSupportPage() {
  return (
    <div className="mx-auto flex h-[calc(100dvh-13rem)] max-w-3xl flex-col md:h-[calc(100dvh-9rem)]">
      <PageHeader title="Help & support" subtitle="Chat with the OyaEat team." />
      <div className="min-h-0 flex-1">
        <ChatInterface role="customer" />
      </div>
    </div>
  );
}
