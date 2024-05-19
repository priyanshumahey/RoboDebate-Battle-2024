import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { ChatOpenAI } from "@langchain/openai";

function getRandomElement(array: any[]) {
	const randomIndex = Math.floor(Math.random() * array.length);
	const randomElement = array[randomIndex];
	return randomElement;
}

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
	const prompt: string = body.prompt

	var messages = []

	const privatization = ['bota', 'botb'];
	const botOne = getRandomElement(privatization);
	const botTwo = privatization.filter(bot => bot !== botOne)[0];

	// The bots will be arguing against each other about the prompt. The first bot will be for the prompt and the second bot will be against the prompt.
	const botOneMessage = `You are to participate in a debate and your goal is to argue in favor of the prompt. 
		The prompt is: ${prompt}. Your response should be at roughly 100 words.`;
	const botTwoMessage = `You are to participate in a debate and your goal is to argue against the prompt. 
		The prompt is: ${prompt}. Your response should be at roughly 100 words.`;

	try {
		const genAI = new GoogleGenerativeAI(apiKeyG);
		const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });

		const gptModel = new ChatOpenAI({
			apiKey: apiKeyO,
			modelName: "gpt-3.5-turbo",
		})

		// Generate the first message for bot A
		const result = await geminiModel.generateContent(botOneMessage);
		const response = await result.response;
		const text = response.text();
		messages.push({ role: botOne, text: text });

		// Generate the first message for bot B
		const result2 = await gptModel.invoke(botTwoMessage);
		const text2 = result2.content
		messages.push({ role: botTwo, text: text2 });
	
		// Generate a rebuttal for bot A
		const result3 = await geminiModel.generateContent(`Your opponent said the following, please create a rebuttal: ${text2}`);
		const response3 = await result3.response;
		const text3 = response3.text();
		messages.push({ role: botOne, text: text3 });

		// Generate a rebuttal for bot B
		const result4 = await gptModel.invoke(`Your opponent said the following, please create a rebuttal: ${text}`);
		const text4 = result4.content
		messages.push({ role: botTwo, text: text4 });

		return NextResponse.json({ messages: messages }, { status: 200 })

		} catch (error) {
			return NextResponse.json({ error: 'Invalid model' }, { status: 400 })
	}
}
