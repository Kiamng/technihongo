import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GEMINI_API_KEY as string,
);

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
            Please translate the following Japanese text into Vietnamese.
            Ensure that the translation maintains the correct IT and software development terminology:
            
            Japanese: ${text}
        `;

    const response = await model.generateContent(prompt);

    console.log("Gemini API Response:", response); // Log toàn bộ phản hồi

    if (
      !response ||
      !response.response ||
      !response.response.candidates ||
      response.response.candidates.length === 0
    ) {
      console.error("Invalid Gemini response:", response);

      return NextResponse.json(
        { error: "Invalid response from Gemini AI" },
        { status: 500 },
      );
    }

    const translatedText =
      response.response.candidates[0].content.parts[0].text;

    return NextResponse.json({ translation: translatedText });
  } catch (error) {
    console.error("Translation error:", error); // Log lỗi cụ thể

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
