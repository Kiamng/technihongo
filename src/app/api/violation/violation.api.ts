import axiosClient from "@/lib/axiosClient";

const ENDPOINT = {
  CREATE_REPORT: "/violation/report",
};

export const createReport = async (
  token: string,
  classifyBy: string,
  contentId: number,
  description: string,
) => {
  const response = await axiosClient.post(
    ENDPOINT.CREATE_REPORT,
    {
      classifyBy: classifyBy,
      contentId: contentId,
      description: description,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
