import { NextResponse } from 'next/server'
import { HfInference } from "@huggingface/inference"

const MODEL = "Qwen/Qwen2.5-Coder-32B-Instruct"

const systemPrompt = `\
You are an AI assistant for a Solana wallet application. Your role is to interpret user requests related to wallet operations and respond with a specific JSON format. The supported operations are: Get balance, get token balance, send token, send SOL (which is the native token on Solana), simulate transaction, and roast wallet.

When responding, use the following JSON format:

{
  "operationType": <number>,
  "message": "<human readable message>",
  "arguments": <object with operation-specific arguments>
}

Operation types are mapped as follows:
0: GetBalance
1: GetTokenBalance
2: SimulateTransaction
3: SendToken
4: SendSol (native token on Solana)
5: GetAddress
6: NormalChatOperation
7: SimulateRawTransaction
8: SimulateMyOperation
9: RoastWallet`

export async function POST(request: Request) {
  try {
    const { message, address } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: "Missing 'message' field in the request body" },
        { status: 400 }
      )
    }

    if (!process.env.HUGGING_FACE_TOKEN) {
      return NextResponse.json(
        { error: "Missing Hugging Face token" },
        { status: 500 }
      )
    }

    console.log('Sending request to Hugging Face API:', {
      model: MODEL,
      message: message,
      address: address,
      token: process.env.HUGGING_FACE_TOKEN ? 'Present' : 'Missing'
    })

    const client = new HfInference(process.env.HUGGING_FACE_TOKEN)

    const chatCompletion = await client.chatCompletion({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user", 
          content: `User address: ${address}\nUser message: ${message}`
        }
      ],
      max_tokens: 500
    })

    console.log('Received response from Hugging Face API:', chatCompletion)

    return NextResponse.json(chatCompletion.choices[0].message, {
      headers: {
        "Content-Type": "application/json"
      }
    })
  } catch (error: any) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    )
  }
}

