import axios from "axios";

const ENDPOINT = {
  GETUSERID: (userId: number) =>
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/getUser/${userId}`,
  UPDATE_USERNAME: (userId: number) =>
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${userId}/username`,
};

export const getUserById = async (token: string, userId: number) => {
  try {
    const response = await axios.get(ENDPOINT.GETUSERID(userId), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const updateUsername = async (
  token: string,
  userId: number,
  newUserName: string,
) => {
  try {
    const response = await axios.patch(
      ENDPOINT.UPDATE_USERNAME(userId),
      { userName: newUserName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error updating username:", error);
    throw error;
  }
};
