'use client';

import { ChatWindow } from "@/components/ChatBot/ChatWindow"
import { ChatbotEmptyCard } from "@/components/ChatBot/EmptyCard"

export default function Chat() {
    return (
        <ChatWindow
            emptyStateComponent={<ChatbotEmptyCard />}
        />
    )
}
