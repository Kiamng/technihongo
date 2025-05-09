import { z } from "zod";

export const RegisterSchema = z
  .object({
    userName: z
      .string()
      .min(4, "Tên hiển thị phải có độ dài tối thiểu 4 kí tự"),
    email: z
      .string({ required_error: "Bạn phải nhập email" })
      .email("Bạn phải nhập 1 email hợp lệ"),
    dob: z
      .string()
      .refine((val) => val !== "", {
        message: "Ngày sinh không được để trống",
      })
      .refine(
        (val) => {
          const selectedDate = new Date(val);
          const today = new Date();

          today.setHours(0, 0, 0, 0);

          return selectedDate <= today;
        },
        {
          message: "Ngày sinh không được là ngày trong tương lai",
        },
      ),
    password: z
      .string({ required_error: "Bạn phải nhật mật khẩu" })
      .min(8, "Mật khẩu phải có độ dài tối thiểu 8 kí tự")
      .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 kí tự thường")
      .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 kí tự in hoa")
      .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 số")
      .regex(/[!@#$%^&*]/, "Mật khẩu phải chứ ít nhất 1 kí tự đặc biệt"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không trùng khớp",
    path: ["confirmPassword"],
  });
