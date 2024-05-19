"use client";

interface ChatMessageBubbleProps {
    message: any;
}

export function ChatMessageBubble(props: ChatMessageBubbleProps) {
    const colorClassName = props.message.role === "bota" ? "rounded-lg bg-red-300 text-black border text-lg"
        : "rounded-lg bg-blue-300 text-black border text-lg";
    const alignmentClassName = props.message.role === "bota" ? "mr-auto" : "ml-auto";
    const prefix = props.message.role === "bota" ? "Bot A:" : "Bot B:";

    return (
        <div className={`mb-8 flex flex-col  w=full`}>
            <div className={`${alignmentClassName} mr-2`}>
                    {prefix}
            </div>
            <div
                className={`${alignmentClassName} ${colorClassName} max-w-[80%] px-4 py-2`}
            >
                <div className="whitespace-pre-wrap flex flex-col">
                    <span>{props.message.text}</span>
                </div>
            </div>
        </div>
    );
}
