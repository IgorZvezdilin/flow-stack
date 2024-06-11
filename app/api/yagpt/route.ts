import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const question = await request.json();
  try {
    const auth = await fetch("https://iam.api.cloud.yandex.net/iam/v1/tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        yandexPassportOauthToken: process.env.YANDEX_OAUTH_KEY,
      }),
    });
    const { iamToken } = await auth.json();
    const response = await fetch(
      "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${iamToken}`,
          "x-folder-id": `${process.env.YANDEX_CATALOG_ID}`,
        },
        body: JSON.stringify({
          modelUri: `gpt://${process.env.YANDEX_CATALOG_ID}/yandexgpt-lite`,
          completionOptions: {
            stream: false,
            temperature: 0.6,
            maxTokens: "2000",
          },
          messages: [
            {
              role: "system",
              text: "You are a knowledgeable assistant that provides quality information about development.",
            },
            {
              role: "user",
              text: `Give me an answer on this question: ${question}`,
            },
          ],
        }),
      },
    );
    const data = await response.json();
    console.log("data", data);
    if ("error" in data && data.error.message)
      throw new Error(data.error.message);
    const reply = data.result.alternatives[0].message.text;
    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json(error.message);
  }
}
