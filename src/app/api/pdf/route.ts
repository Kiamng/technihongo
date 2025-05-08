import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const publicId = searchParams.get("publicId");

  if (!publicId) {
    return new Response("Missing publicId", { status: 400 });
  }

  const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload/${publicId}.pdf`;

  try {
    const res = await fetch(cloudinaryUrl);

    if (!res.ok || !res.body) {
      throw new Error("Cloudinary fetch failed");
    }

    return new Response(res.body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": res.headers.get("content-length") || "",
        "Content-Disposition": "inline; filename=resource.pdf",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("PDF proxy error:", error);

    return new Response("Failed to load PDF", { status: 500 });
  }
}
