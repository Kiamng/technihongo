import * as z from "zod";

import axiosClient from "@/lib/axiosClient";
import { RegisterSchema } from "@/schema/auth/register";

type GoogleRegister = {
  name: string | null | undefined;
  email: string | null | undefined;
  roleId: string | null | undefined;
  picture: string | null | undefined;
};

const ENDPOINT = {
  LOGIN: "/user/login",
  REGISTER: "/user/register",
  REGISTER_GOOGLE: "/auth/register/google",
  LOGIN_GOOGLE: "/auth/login/google",
  VERIFY: "/auth/mail",
};

export const login = async (email: string, password: string) => {
  const response = await axiosClient.post(ENDPOINT.LOGIN, {
    email: email,
    password: password,
  });

  return response.data;
};

export const register = async (values: z.infer<typeof RegisterSchema>) => {
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

export const googleRegister = async (values: GoogleRegister) => {
  const response = await axiosClient.post(ENDPOINT.REGISTER_GOOGLE, {
    name: values.name,
    email: values.email,
    roleId: values.roleId,
    picture: values.picture,
  });

  return response.data;
};

export const googleLogin = async (email: string) => {
  const response = await axiosClient.post(
    `${ENDPOINT.LOGIN_GOOGLE}?email=${email}`,
  );

  return response.data;
};
