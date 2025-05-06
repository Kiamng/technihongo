export type Meeting = {
  meetingId: number;
  title: string;
  description: string;
  voiceName: string;
  scriptsCount: number;
  isActive: boolean;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MeetingList = {
  content: Meeting[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type Script = {
  scriptId: number;
  meeting: Meeting;
  question: string;
  questionExplain: string;
  answer: string;
  answerExplain: string;
  scriptOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ScriptList = {
  content: Script[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};
