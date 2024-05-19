'use client';

import { useEffect, useRef, useState, type ReactElement } from "react";
import { ChatMessageBubble } from '@/components/ChatBot/ChatMessageBubble';
import { Button } from "../ui/button";
import Link from "next/link";

interface chatWindowProps {
    emptyStateComponent: ReactElement
}

export function ChatWindow(props: chatWindowProps) {
    const messageContainerRef = useRef<HTMLDivElement | null>(null);
    const [alreadyClickedReveal, setAlreadyClickedReveal] = useState(false);
    const [alreadyClicked, setAlreadyClicked] = useState(false);
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
        setAlreadyClicked(true);
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

    const revealAI = () => {
        const newMessages = [...messages];
        newMessages.push({
            role: "bota",
            text: "I am powered by Google Gemini",
        });
        newMessages.push({
            role: "botb",
            text: "I am powered by OpenAI GPT",
        });
        setMessages(newMessages);

        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
        setAlreadyClickedReveal(true);
    }


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
            <div className="flex flex-row w-1/3 space-x-10">
                <Button onClick={prepNextStage} className="w-full" disabled={alreadyClicked}>Next</Button>
                <Button onClick={revealAI} className="w-full" disabled={alreadyClickedReveal}>Reveal</Button>
            </div>
            {(alreadyClickedReveal && alreadyClicked) ? <Button className="w-1/3 mt-4"><Link href="/results">View Results</Link></Button> : ""}
        </div>
    );
}

