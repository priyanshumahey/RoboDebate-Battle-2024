'use client';

import { useRef, useState, type ReactElement } from "react";
import { ChatMessageBubble } from '@/components/ChatBot/ChatMessageBubble';

interface chatWindowProps {
    emptyStateComponent: ReactElement
}

export function ChatWindow(props: chatWindowProps) {
    const messageContainerRef = useRef<HTMLDivElement | null>(null);
    const [messages, setMessages] = useState([
        {
            role: "bota",
            text: "Hello! How can I help you today?",
        },
        {
            role: "botb",
            text: "I need help with my account",
        }
    ]);

    return (
        <div className={`flex flex-col items-center p-4 md:p-8 rounded grow overflow-hidden ${(messages.length > 0 ? "border" : "")}`}>
            {messages.length === 0 ? props.emptyStateComponent : ""}
            <div
                className="flex flex-col-reverse w-full mb-4 overflow-auto transition-[flex-grow] ease-in-out"
                ref={messageContainerRef}
            >
                {messages.length > 0 ? (
                    [...messages]
                        .reverse()
                        .map((m, i) => {
                            const sourceKey = (messages.length - 1 - i).toString();
                            return (<ChatMessageBubble key={sourceKey} message={m}></ChatMessageBubble>)
                        })
                ) : (
                    ""
                )}
            </div>
        </div>
    );
}

