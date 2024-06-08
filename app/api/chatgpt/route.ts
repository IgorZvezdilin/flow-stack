import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const question = await request.json();
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CHATGPT_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a knowledgeable assistant that provides quality information.",
          },
          {
            role: "user",
            content: `Give me an answer on this question: ${question}`,
          },
        ],
      }),
    });
    // console.log(response);
    const data = await response.json();
    console.log(data);
    if ("error" in data && data.error.message) throw new Error(data.error);
    // const reply = data.choices[0].message.content;
    const reply = 200;
    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
