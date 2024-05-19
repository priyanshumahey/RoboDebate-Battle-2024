'use client';

import { useEffect, useRef, useState, type ReactElement } from "react";
import { ChatMessageBubble } from '@/components/ChatBot/ChatMessageBubble';
import { Button } from "../ui/button";

interface chatWindowProps {
    emptyStateComponent: ReactElement
}

export function ChatWindow(props: chatWindowProps) {
    const messageContainerRef = useRef<HTMLDivElement | null>(null);
    const [prompt, setPrompt] = useState("");

    const [messages, setMessages] = useState([
        {
            role: "bota",
            text: "Hello! I'm Bot A!",
        },
        {
            role: "botb",
            text: "Hi, I'm Bot B!",
        }
    ]);

    const prepNextStage = () => {
        async function fetchMessages() {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/debate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ prompt: prompt }),
                });
            const data = await response.json();
            const newMessages = [...messages];
            data.messages.forEach((m: { role: string; text: string; }) => {
                newMessages.push(m);
            });
            setMessages(newMessages);
        }

        fetchMessages();
    }
    
    const fetchData = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meta`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        const data = await response.json();
        return data;
    }

    useEffect(() => {
        fetchData().then((data) => {
            const prompt = data[0].prompt;
            setPrompt(prompt);
        });
    }, []);


    return (
        <div className={`flex flex-col items-center rounded grow overflow-hidden`}>
            <h1 className="text-4xl font-bold">Which one is better?</h1>
            <h2 className="text-2xl font-bold">Prompt: <span className="underline text-violet-500">{prompt}</span></h2>
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
            <Button onClick={prepNextStage}>Next</Button>
        </div>
    );
}

