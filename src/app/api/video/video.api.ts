import axiosClient from "@/lib/axiosClient";

const ENDPOINT = {
  GET_VIDEO: "/api/video",
};

export const extractCloudinaryPublicId = (videoUrl: string): string | null => {
  const parts = videoUrl.split("/upload/");

  if (parts.length < 2) return null;

  const pathWithExtension = parts[1];
  const noVersion = pathWithExtension.replace(/^v\d+\//, "");

  return noVersion.replace(/\.(mp4|webm|ogv|pdf)$/, "");
};

export const getVideo = async (publicId: string, token: string) => {
  const response = await axiosClient.get(
    `${ENDPOINT.GET_VIDEO}?publicId=${publicId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    },
  );

  return response;
};
