// import axiosClient from "@/lib/axiosClient";
// import { CourseList, CourseProgress } from "@/types/course";

// const ENDPOINT = {
//   ALL: "/course/all/paginated",
//   GET_ALL_COURSE_PROGRESS_BY_STUDENT_ID: "/course-progress/all",
//   GET_A_STUDENT_COURSE_PROGRESS: "/course-progress/view",
//   TRACK_STUDENT_COURSE_PROGRESS: "/course-progress/track",
// };

// export const getAllCourse = async ({
//   token,
//   pageNo,
//   pageSize,
//   sortBy,
//   sortDir,
// }: {
//   token: string;
//   pageNo?: number;
//   pageSize?: number;
//   sortBy?: string;
//   sortDir?: string;
// }): Promise<CourseList> => {
//   const params = new URLSearchParams();

//   if (pageNo) params.append("pageNo", pageNo.toString());
//   if (pageSize) params.append("pageSize", pageSize.toString());
//   if (sortBy) params.append("sortBy", sortBy);
//   if (sortDir) params.append("sortDir", sortDir);

//   const response = await axiosClient.get(
//     `${ENDPOINT.ALL}?${params.toString()}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     },
//   );

//   return response.data.data as CourseList;
// };

// export const getStudentAllCourseProgress = async (
//   studentId: number,
//   token: string,
// ): Promise<CourseProgress[]> => {
//   const response = await axiosClient.get(
//     `${ENDPOINT.GET_ALL_COURSE_PROGRESS_BY_STUDENT_ID}/${studentId}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     },
//   );

//   return response.data.data;
// };

// export const getAStudentCourseProgress = async (
//   studentId: number,
//   token: string,
//   courseId: number,
// ): Promise<CourseProgress> => {
//   const response = await axiosClient.get(
//     `${ENDPOINT.GET_A_STUDENT_COURSE_PROGRESS}/${studentId}?courseId=${courseId}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     },
//   );

//   return response.data.data;
// };

// export const trackStudentCourseProgress = async (
//   token: string,
//   courseId: number,
// ): Promise<void> => {
//   const response = await axiosClient.patch(
//     `${ENDPOINT.TRACK_STUDENT_COURSE_PROGRESS}?courseId=${courseId}`,
//     {},
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     },
//   );

//   return response.data.data;
// };
import axiosClient from "@/lib/axiosClient";
import { CourseList, CourseProgress } from "@/types/course";

const ENDPOINT = {
  ALL: "/course/all/paginated",
  GET_ALL_COURSE_PROGRESS_BY_STUDENT_ID: "/course-progress/all",
  GET_A_STUDENT_COURSE_PROGRESS: "/course-progress/view",
  TRACK_STUDENT_COURSE_PROGRESS: "/course-progress/track",
  GET_AVERAGE_COURSE_RATING: "/student-course-rating/average",
  GET_COURSE_RATINGS: "/student-course-rating/course/ratings",
  CREATE_COURSE_RATING: "/student-course-rating/createRating",
  GET_STUDENT_COURSE_RATING: "/student-course-rating/student-rating/course",
  UPDATE_COURSE_RATING: "/student-course-rating/update",
  DELETE_COURSE_RATING: "/student-course-rating/delete",
};

export interface CourseRating {
  ratingId: number;
  studentId: number;
  userName: string;
  profileImg: string | null;
  courseId: number;
  rating: number;
  review?: string;
}

export const getAllCourse = async ({
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
}): Promise<CourseList> => {
  const params = new URLSearchParams();

  if (pageNo) params.append("pageNo", pageNo.toString());
  if (pageSize) params.append("pageSize", pageSize.toString());
  if (sortBy) params.append("sortBy", sortBy);
  if (sortDir) params.append("sortDir", sortDir);

  const response = await axiosClient.get(
    `${ENDPOINT.ALL}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data as CourseList;
};

export const getStudentAllCourseProgress = async (
  studentId: number,
  token: string,
): Promise<CourseProgress[]> => {
  const response = await axiosClient.get(
    `${ENDPOINT.GET_ALL_COURSE_PROGRESS_BY_STUDENT_ID}/${studentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data;
};

export const getAStudentCourseProgress = async (
  studentId: number,
  token: string,
  courseId: number,
): Promise<CourseProgress> => {
  const response = await axiosClient.get(
    `${ENDPOINT.GET_A_STUDENT_COURSE_PROGRESS}/${studentId}?courseId=${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data;
};

export const trackStudentCourseProgress = async (
  token: string,
  courseId: number,
): Promise<void> => {
  const response = await axiosClient.patch(
    `${ENDPOINT.TRACK_STUDENT_COURSE_PROGRESS}?courseId=${courseId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data;
};

export const getAverageCourseRating = async (
  courseId: number,
  token: string,
): Promise<number> => {
  const response = await axiosClient.get(
    `${ENDPOINT.GET_AVERAGE_COURSE_RATING}/${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const rating = Number(response.data.data);

  return isNaN(rating) ? 0 : rating;
};

export const getCourseRatings = async ({
  courseId,
  token,
}: {
  courseId: number;
  token: string;
}): Promise<CourseRating[]> => {
  const response = await axiosClient.get(
    `${ENDPOINT.GET_COURSE_RATINGS}/${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data.content as CourseRating[];
};

export const createCourseRating = async ({
  courseId,
  rating,
  review,
  token,
}: {
  courseId: number;
  rating: number;
  review: string;
  token: string;
}): Promise<CourseRating> => {
  const response = await axiosClient.post(
    ENDPOINT.CREATE_COURSE_RATING,
    {
      courseId,
      rating,
      review,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data as CourseRating;
};

export const getStudentCourseRating = async ({
  courseId,
  token,
}: {
  courseId: number;
  token: string;
}): Promise<CourseRating | null> => {
  try {
    const response = await axiosClient.get(
      `${ENDPOINT.GET_STUDENT_COURSE_RATING}/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.data as CourseRating;
  } catch (error) {
    return null;
  }
};

export const updateCourseRating = async ({
  ratingId,
  courseId,
  rating,
  review,
  token,
}: {
  ratingId: number;
  courseId: number;
  rating: number;
  review: string;
  token: string;
}): Promise<CourseRating> => {
  const response = await axiosClient.patch(
    `${ENDPOINT.UPDATE_COURSE_RATING}/${ratingId}`,
    {
      courseId,
      rating,
      review,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data as CourseRating;
};

export const deleteCourseRating = async ({
  ratingId,
  token,
}: {
  ratingId: number;
  token: string;
}): Promise<void> => {
  const response = await axiosClient.delete(
    `${ENDPOINT.DELETE_COURSE_RATING}/${ratingId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
