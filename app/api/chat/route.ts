import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import { getScamCheckResponse } from 'app/api/constant/scam';

const MODEL = 'Qwen/Qwen2.5-Coder-32B-Instruct';

interface ResponseArguments {
  tokenAddress?: string;
}

interface ChatCompletionResponse {
  operationType: number;
  message: string;
  arguments: ResponseArguments | null;
}

export async function POST(request: Request) {
  try {
    const { message, address } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Missing 'message' field in the request body" }, { status: 400 });
    }

    if (!process.env.HUGGING_FACE_TOKEN) {
      return NextResponse.json({ error: "Missing Hugging Face token" }, { status: 500 });
    }

    const client = new HfInference(process.env.HUGGING_FACE_TOKEN);

    const chatCompletion = await client.chatCompletion({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `User address: ${address}\nUser message: ${message}` },
      ],
      max_tokens: 500,
    });

    // Parse the response content
    const content = chatCompletion.choices[0].message.content;
    let response: ChatCompletionResponse;

    try {
      if (typeof content === 'string') {
        response = JSON.parse(content) as ChatCompletionResponse;
      } else {
        throw new Error('Invalid content type');
      }
    } catch (parseError) {
      throw new Error('Failed to parse Hugging Face API response content.');
    }
 
    if (response.operationType === 10 && response.arguments?.tokenAddress) {
      const scamCheckResponse = getScamCheckResponse(response.arguments.tokenAddress);
      response.message = scamCheckResponse;
    }

    return NextResponse.json(response, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
