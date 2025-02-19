"use client";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    console.log("Form data submitted:", data);
    setIsPending(true);

    setTimeout(() => {
      setIsPending(false);
      alert("Login successful");
    }, 2000);
  };

  return (
    <div className="login-form w-[600px] h-full flex flex-col gap-y-5 px-[25px] py-[75px] rounded-[20px] bg-white">
      <h1 className="text-xl font-extrabold text-center">Đăng nhập</h1>
      <form
        className="w-full flex flex-col gap-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Email Field */}
        <div className="grid w-full max-w-sm items-center gap-1.5 relative">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Mail className="w-5 h-5" />
            </span>
            <Input
              className="pl-10"
              disabled={isPending}
              id="email"
              placeholder="Nhập email tại đây"
              type="email"
              {...register("email", {
                required: "Bạn cần phải nhập email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email không hợp lệ",
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="grid w-full max-w-sm items-center gap-1.5 relative">
          <Label htmlFor="password">Mật khẩu</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Lock className="w-5 h-5" />
            </span>
            <Input
              className="pl-10 pr-10"
              disabled={isPending}
              id="password"
              placeholder="Nhập mật khẩu tại đây"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Bạn cần phải nhập mật khẩu",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              })}
            />
            <button
              className="absolute inset-y-0 right-3 flex items-center text-gray-400"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <Link className="font-medium text-end text-lg text-[#57D061]" href={""}>
          Quên mật khẩu ?
        </Link>
        {/* Submit Button */}
        {isPending ? (
          <Button
            className="ml-auto w-full text-lg"
            disabled={isPending}
            type="submit"
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang xử lí
          </Button>
        ) : (
          <Button
            className="ml-auto w-full text-lg"
            type="submit"
            onClick={() => toast}
          >
            Đăng nhập
          </Button>
        )}
      </form>
      <p className="font-medium text-center text-lg">Hoặc đăng nhập với</p>
      <Button className="ml-auto w-full text-lg" variant="outline">
        Google
      </Button>
      <p className="font-medium text-center text-lg">
        Bạn chưa có tài khoản ?
        <span className="text-[#57D061]">
          <Link href={"/sign-in"}> Đăng ký</Link>
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
