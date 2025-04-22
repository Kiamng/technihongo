import { NextRequest } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const publicId = searchParams.get("publicId");

  if (!publicId) {
    return new Response("Missing publicId", { status: 400 });
  }

  const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload/${publicId}.pdf`;

  try {
    const response = await axios.get(cloudinaryUrl, {
      responseType: "stream",
    });

    return new Response(response.data, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("PDF proxy error:", error);

    return new Response("Failed to load PDF", { status: 500 });
  }
}
