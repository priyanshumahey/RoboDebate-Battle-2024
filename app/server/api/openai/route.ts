import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { ChatOpenAI } from "@langchain/openai";

export async function POST(request: Request) {
	const apiKeyO = process.env.OPENAI_API_KEY;

	if (!apiKeyO) {
		return NextResponse.json({ error: 'Internal Server Erro, OpenAI key not foundr' }, { status: 500 })
	}

	const body = await request.json();
	const prompt: string = body.prompt;
	
	if (!prompt) {
		return NextResponse.json({ error: 'No prompt sent' }, { status: 400 })
	}
	
	try {
		const model = new ChatOpenAI({
			apiKey: apiKeyO,
			modelName: "gpt-3.5-turbo",
		})

		const response = await model.invoke(prompt);

		return NextResponse.json({ text: response.content });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
