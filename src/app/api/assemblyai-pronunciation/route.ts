import { NextRequest, NextResponse } from "next/server";

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY!;
const ASSEMBLYAI_BASE_URL = "https://api.assemblyai.com";

async function uploadAudio(fileBuffer: Buffer) {
  const response = await fetch(`${ASSEMBLYAI_BASE_URL}/v2/upload`, {
    method: "POST",
    headers: {
      authorization: ASSEMBLYAI_API_KEY,
    },
    body: fileBuffer,
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error("Upload error:", errorText);
    throw new Error("Failed to upload audio");
  }

  const data = await response.json();

  return data.upload_url;
}

async function requestTranscription(audioUrl: string) {
  const payload = {
    audio_url: audioUrl,
    language_code: "ja", // Japanese
    speech_model: "universal",
    punctuate: true,
    format_text: true,
    disfluencies: false,
    speaker_labels: false,
    summarization: false,
  };

  const response = await fetch(`${ASSEMBLYAI_BASE_URL}/v2/transcript`, {
    method: "POST",
    headers: {
      authorization: ASSEMBLYAI_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error("Transcript request error:", errorText);
    throw new Error("Failed to request transcription");
  }

  const data = await response.json();

  return data.id;
}

async function pollTranscriptionStatus(transcriptId: string) {
  const pollingEndpoint = `${ASSEMBLYAI_BASE_URL}/v2/transcript/${transcriptId}`;

  while (true) {
    const response = await fetch(pollingEndpoint, {
      headers: {
        authorization: ASSEMBLYAI_API_KEY,
      },
    });

    const data = await response.json();

    if (data.status === "completed") {
      return data;
    }

    if (data.status === "error") {
      console.error("Polling error:", data.error);
      throw new Error(`Polling failed: ${data.error}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("audio") as Blob;

    if (!file) {
      return NextResponse.json(
        { error: "Audio file is required." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const audioUrl = await uploadAudio(buffer);
    const transcriptId = await requestTranscription(audioUrl);
    const transcriptionResult = await pollTranscriptionStatus(transcriptId);

    return NextResponse.json(transcriptionResult);
  } catch (error) {
    console.error("Server error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
