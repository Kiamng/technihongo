import * as z from "zod";

import axiosClient from "@/lib/axiosClient";
import { RegisterSchema } from "@/schema/auth/register";
import { RegisterResponse } from "@/types/user";

const ENDPOINT = {
  LOGIN: "/user/login",
  REGISTER: "/user/register",
  LOGIN_GOOGLE: "/user/google-auth",
  RESEND_EMAIL: "/user/resend-verification-email?email",
  VERIFY_EMAIL: "/user/verify-email?token",
};

export const login = async (email: string, password: string) => {
  const response = await axiosClient.post(ENDPOINT.LOGIN, {
    email: email,
    password: password,
  });

  return response.data;
};

export const register = async (
  values: z.infer<typeof RegisterSchema>,
): Promise<RegisterResponse> => {
  const response = await axiosClient.post(ENDPOINT.REGISTER, {
    userName: values.userName,
    email: values.email,
    password: values.password,
    confirmPassword: values.confirmPassword,
    dob: values.dob,
    occupation: "STUDENT",
  });

  return response.data;
};

export const googleLogin = async (accessToken: string) => {
  const response = await axiosClient.post(ENDPOINT.LOGIN_GOOGLE, {
    accessToken: accessToken,
  });

  return response.data;
};

export const resendEmail = async (email: string) => {
  const response = await axiosClient.post(`${ENDPOINT.RESEND_EMAIL}=${email}`);

  return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await axiosClient.patch(`${ENDPOINT.VERIFY_EMAIL}=${token}`);

  return response.data;
};
