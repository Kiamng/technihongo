// app/api/video/route.ts
import { NextRequest } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const publicId = searchParams.get("publicId");

  if (!publicId) {
    return new Response(JSON.stringify({ error: "Missing publicId" }), {
      status: 400,
    });
  }

  const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${publicId}.mp4`;

  try {
    const response = await axios.get(cloudinaryUrl, {
      responseType: "stream",
    });

    const readableStream = response.data;

    return new Response(readableStream, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error streaming video:", error);

    return new Response(JSON.stringify({ error: "Could not load video" }), {
      status: 500,
    });
  }
}
