// src/app/api/study-plan/study-plan.api.ts
import axiosClient from "@/lib/axiosClient";
import { StudentActiveStudyPlan, StudyPlan } from "@/types/study-plan";

const ENDPOINT = {
  GET_BY_COURSE: "/study-plan/course",
  GET_BY_ID: "/study-plan",
  GET_STUDENT_ACTIVE_STUDY_PLAN: "/student-study-plan/activeStudyPlan",
  GET_ALL_AVAILABLE_STUDY_PLAN: "/study-plan/course",
  SWITCH_STUDY_PLAN: "/student-study-plan/switchStudyPlan",
};

export const getStudyPlansByCourse = async ({
  token,
  courseId,
}: {
  token: string;
  courseId: number;
}): Promise<any> => {
  const response = await axiosClient.get(
    `${ENDPOINT.GET_BY_COURSE}/${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data;
};

export const getStudyPlanById = async (
  studyPlanId: number,
  token: string,
): Promise<StudyPlan> => {
  const response = await axiosClient.get(
    `${ENDPOINT.GET_BY_ID}/${studyPlanId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data;
};

export const getStudentActiveStudyPlan = async (
  token: string,
  courseId: number,
): Promise<StudentActiveStudyPlan> => {
  const response = await axiosClient.get(
    `${ENDPOINT.GET_STUDENT_ACTIVE_STUDY_PLAN}/${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data;
};

export const getCourseAvailableStudyPlan = async (
  token: string,
  courseId: number,
): Promise<StudyPlan[]> => {
  const response = await axiosClient.get(
    `${ENDPOINT.GET_ALL_AVAILABLE_STUDY_PLAN}/${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data;
};

export const switchStudyPlan = async (
  token: string,
  studentId: number,
  newStudyPlanId: number,
  currentStudyPlanId: number,
) => {
  const response = await axiosClient.post(
    ENDPOINT.SWITCH_STUDY_PLAN,
    {
      studentId: studentId,
      newStudyPlanId: newStudyPlanId,
      currentStudyPlanId: currentStudyPlanId,
    },
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.data;
};
