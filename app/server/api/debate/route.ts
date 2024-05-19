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

	// The bots will be arguing against each other about the prompt. The first bot will be for the prompt and the second bot will be against the prompt.
	const optionOne = `You are to participate in a debate and your goal is to argue in favor of the prompt. 
		The prompt is: ${prompt}. Your response should be at roughly 100 words.`;
	const optionTwo = `You are to participate in a debate and your goal is to argue against the prompt. 
		The prompt is: ${prompt}. Your response should be at roughly 100 words.`;

	const botOneMessage = getRandomElement([optionOne, optionTwo]);
	// The other bot will be against the prompt
	const botTwoMessage = botOneMessage === optionOne ? optionTwo : optionOne;

	try {
		const genAI = new GoogleGenerativeAI(apiKeyG);
		const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

		const gptModel = new ChatOpenAI({
			apiKey: apiKeyO,
			modelName: "gpt-4o",
		})

		messages.push({ role: "bota", text: "I am arguing " + (botOneMessage === optionOne ? "for" : "against")});

		// Generate the first message for bot A
		const result = await geminiModel.generateContent(botOneMessage);
		const response = await result.response;
		const text = response.text();
		messages.push({ role: "bota", text: text });

		messages.push({ role: "botb", text: "I am arguing " + (botTwoMessage === optionOne ? "for" : "against")});

		// Generate the first message for bot B
		const result2 = await gptModel.invoke(botTwoMessage);
		const text2 = result2.content
		messages.push({ role: "botb", text: text2 });
	
		// Generate a rebuttal for bot A
		const result3 = await geminiModel.generateContent(`Your opponent said the following, please create a rebuttal: ${text2}. Keep it short and sweet.`);
		const response3 = await result3.response;
		const text3 = response3.text();
		messages.push({ role: "bota", text: text3 });

		// Generate a rebuttal for bot B
		const result4 = await gptModel.invoke(`Your opponent said the following, please create a rebuttal: ${text}. Keep it short and sweet.`);
		const text4 = result4.content
		messages.push({ role: "botb", text: text4 });

		// Generate a closing statement for bot A
		const result5 = await geminiModel.generateContent(`Your opponent said the following, please create a closing statement: ${text4}. Keep it short and sweet.`);
		const response5 = await result5.response;
		const text5 = response5.text();
		messages.push({ role: "bota", text: text5 });

		// Generate a closing statement for bot B
		const result6 = await gptModel.invoke(`Your opponent said the following, please create a closing statement: ${text3}. Keep it short and sweet.`);
		const text6 = result6.content
		messages.push({ role: "botb", text: text6 });

		return NextResponse.json({ messages: messages }, { status: 200 })

		} catch (error) {
			return NextResponse.json({ error: 'Invalid model' }, { status: 400 })
	}
}
