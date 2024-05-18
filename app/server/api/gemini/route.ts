import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: Request) {
	const apiKey = process.env.GEMINI_KEY;
	if (!apiKey) {
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}

	const body = await request.json();
	const message = body.message;
	
	if (!message) {
		return NextResponse.json({ error: 'No message sent' }, { status: 400 })
	}

	try {
		const genAI = new GoogleGenerativeAI(apiKey);
		const model = genAI.getGenerativeModel({ model: "gemini-pro"});
		const result = await model.generateContent(message);
		const response = await result.response;
		const text = response.text();
		return NextResponse.json({ text });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
