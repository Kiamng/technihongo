import axiosClient from "@/lib/axiosClient";
import { Meeting, MeetingList, ScriptList } from "@/types/meeting";

const ENDPOINT = {
  GET_ALL: "/meeting/all",
  GET_BY_ID: "/meeting",
  GET_SCRIPTS_BY_MEETING_ID: "/script/meeting",
  COMPLETE_MEETING: "/meeting/complete",
};

export const getAllMeeting = async ({
  token,
  pageNo,
  pageSize,
  sortBy,
  sortDir,
}: {
  token: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}): Promise<MeetingList> => {
  const params = new URLSearchParams();

  if (pageNo) params.append("pageNo", pageNo.toString());
  if (pageSize) params.append("pageSize", pageSize.toString());
  if (sortBy) params.append("sortBy", sortBy);
  if (sortDir) params.append("sortDir", sortDir);
  const response = await axiosClient.get(
    `${ENDPOINT.GET_ALL}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data;
};

export const getMeetingById = async (
  token: string,
  meetingId: number,
): Promise<Meeting> => {
  const response = await axiosClient.get(`${ENDPOINT.GET_BY_ID}/${meetingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const getScriptsByMeetingId = async ({
  meetingId,
  token,
  pageNo,
  pageSize,
  sortBy,
  sortDir,
}: {
  meetingId: string;
  token: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}): Promise<ScriptList> => {
  const params = new URLSearchParams();

  if (pageNo) params.append("pageNo", pageNo.toString());
  if (pageSize) params.append("pageSize", pageSize.toString());
  if (sortBy) params.append("sortBy", sortBy);
  if (sortDir) params.append("sortDir", sortDir);
  const response = await axiosClient.get(
    `${ENDPOINT.GET_SCRIPTS_BY_MEETING_ID}/${meetingId}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data;
};

export const completeMeeting = async ({
  token,
  meetingId,
}: {
  token: string;
  meetingId: number;
}): Promise<{ success: boolean }> => {
  const response = await axiosClient.post(
    `${ENDPOINT.COMPLETE_MEETING}/${meetingId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
