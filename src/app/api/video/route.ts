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
    const headRes = await axios.head(cloudinaryUrl);
    const totalSize = parseInt(headRes.headers["content-length"]);
    const range = req.headers.get("Range");

    // Nếu không có Range, chỉ trả về 1MB đầu tiên thay vì toàn bộ video
    if (!range) {
      const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB
      const start = 0;
      const end = Math.min(start + CHUNK_SIZE - 1, totalSize - 1);

      const streamRes = await axios.get(cloudinaryUrl, {
        responseType: "stream",
        headers: {
          Range: `bytes=${start}-${end}`,
        },
      });

      return new Response(streamRes.data, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${totalSize}`,
          "Content-Length": (end - start + 1).toString(),
          "Content-Type": "video/mp4",
          "Accept-Ranges": "bytes",
        },
      });
    }

    // Trường hợp có Range: xử lý tua
    const match = range.match(/bytes=(\d+)-(\d+)?/);

    if (!match) {
      return new Response("Invalid Range", { status: 416 });
    }

    const start = parseInt(match[1]);
    const end = match[2] ? parseInt(match[2]) : totalSize - 1;
    const chunkSize = end - start + 1;

    const streamRes = await axios.get(cloudinaryUrl, {
      responseType: "stream",
      headers: {
        Range: `bytes=${start}-${end}`,
      },
    });

    return new Response(streamRes.data, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${totalSize}`,
        "Content-Length": chunkSize.toString(),
        "Content-Type": "video/mp4",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error) {
    console.error("Error loading video:", error);

    return new Response(JSON.stringify({ error: "Could not load video" }), {
      status: 500,
    });
  }
}
