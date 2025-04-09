import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text, from = "auto", to = "vi" } = await req.json();

  if (!text || text.trim() === "") {
    return NextResponse.json(
      { error: "Vui lòng nhập văn bản cần dịch" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      "https://google-translate113.p.rapidapi.com/api/v1/translator/text",
      {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",

          "X-RapidAPI-Key":
            process.env.RAPIDAPI_KEY ||
            "d5e14a2f20msh0b2639316f750b8p187c63jsndb962dfbd864",
          "X-RapidAPI-Host": "google-translate113.p.rapidapi.com",
        },
        body: new URLSearchParams({
          from,
          to,
          text,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.text();

      throw new Error(`API trả về lỗi: ${response.status} - ${errorData}`);
    }

    const data = await response.json();

    return NextResponse.json({
      translation:
        data.trans || data.translation || "Không thể dịch văn bản này",
    });
  } catch (error) {
    console.error("Lỗi dịch thuật:", error);

    return NextResponse.json(
      {
        error: "Lỗi dịch thuật",
        details: error instanceof Error ? error.message : "Lỗi không xác định",
      },
      { status: 500 },
    );
  }
}
