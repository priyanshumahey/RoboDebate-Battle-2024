import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { ChatOpenAI } from "@langchain/openai";

export async function POST(request: Request) {
	const apiKeyG = process.env.GEMINI_KEY;
	const apiKeyO = process.env.OPENAI_API_KEY;
	if (!apiKeyG) {
		return NextResponse.json({ error: 'Internal Server Error, Gemini key not found' }, { status: 500 })
	}
	if (!apiKeyO) {
		return NextResponse.json({ error: 'Internal Server Erro, OpenAI key not foundr' }, { status: 500 })
	}

	const body = await request.json();
	const prompt: string = body.prompt;
	var model: "openai" | "gemini" | "random" = body.model || 'random';

	function getRandomElement(array: any[]) {
		const randomIndex = Math.floor(Math.random() * array.length);
		const randomElement = array[randomIndex];
		return randomElement;
	}

	if (model === 'random') {
		const models = ['openai', 'gemini'];
		model = getRandomElement(models);
	}

	if (!prompt) {
		return NextResponse.json({ error: 'No prompt sent' }, { status: 400 })
	}

	if (model === 'gemini') {
		try {
			const genAI = new GoogleGenerativeAI(apiKeyG);
			const model = genAI.getGenerativeModel({ model: "gemini-pro" });
			const result = await model.generateContent(prompt);
			const response = await result.response;
			const text = response.text();
			return NextResponse.json({ text });

		} catch (error) {
			console.error(error);

			return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
		}

	} else if (model === 'openai') {
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

	} else {
		return NextResponse.json({ error: 'Invalid model' }, { status: 400 })
	}
}
