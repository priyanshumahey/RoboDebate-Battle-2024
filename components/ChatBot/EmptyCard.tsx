"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export function ChatbotEmptyCard() {
    return (
        <Card className="md:w-2/3 w-4/5">
            <CardHeader>
                <CardTitle>Debate Battle</CardTitle>
                <CardDescription>Lorem Ispeum Doreum</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col">
                    <h1>Lorem Ispeum Doreum</h1>
                </div>
            </CardContent>
        </Card>
    )
}
