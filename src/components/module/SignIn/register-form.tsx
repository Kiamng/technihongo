"use client";
import { User, Mail, Lock, Eye, EyeOff, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { RegisterSchema } from "@/schema/auth/register";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/app/api/auth/auth.api";

const RegisterForm = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
    defaultValues: {
      userName: "",
      email: "",
      dob: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    try {
      setIsPending(!isPending);
      const response = await register(values);

      if (response.success === false) {
        toast.error("Đã có lỗi khi đăng ký tài khoản, thử lại sau");
      } else {
        toast.success("Đăng ký thành công!");
        router.push("/login");
      }
    } catch (error) {
      return error;
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-[50%]">
      <div className="login-form w-[500px] h-full flex flex-col gap-y-5 mx-auto">
        <h1 className="text-xl font-extrabold text-center">Đăng ký</h1>
        <Form {...form}>
          <form
            className="w-full flex flex-col gap-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Username */}
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid w-full items-center gap-1.5 relative">
                      <Label htmlFor="email">Tên</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                          <User className="w-5 h-5" />
                        </span>
                        <Input
                          disabled={isPending}
                          placeholder="Nhập tên tại đây"
                          type="text"
                          {...field}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid w-full items-center gap-1.5 relative">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                          <Mail className="w-5 h-5" />
                        </span>
                        <Input
                          disabled={isPending}
                          placeholder="Nhập email tại đây"
                          type="email"
                          {...field}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid w-full items-center gap-1.5 relative">
                      <Label htmlFor="dob">Ngày sinh</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                          <Calendar className="w-5 h-5" />
                        </span>
                        <Input
                          disabled={isPending}
                          placeholder="Chọn ngày sinh"
                          type="date"
                          {...field}
                          className="pl-10 "
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid w-full items-center gap-1.5 relative">
                      <Label htmlFor="email">Mật khẩu</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                          <Lock className="w-5 h-5" />
                        </span>
                        <Input
                          disabled={isPending}
                          placeholder="Nhập mật khẩu tại đây"
                          type={showPassword ? "text" : "password"}
                          {...field}
                          className="pl-10 pr-10"
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
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid w-full  items-center gap-1.5 relative">
                      <Label htmlFor="email">Nhập lại mật khẩu</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                          <Lock className="w-5 h-5" />
                        </span>
                        <Input
                          disabled={isPending}
                          placeholder="Nhập lại mật khẩu"
                          type={showConfirmPassword ? "text" : "password"}
                          {...field}
                          className="pl-10 pr-10"
                        />
                        <button
                          className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            {isPending ? (
              <Button
                className="ml-auto w-full mt-4 text-lg"
                disabled={isPending}
                type="submit"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lí
              </Button>
            ) : (
              <Button
                className="ml-auto w-full mt-4 text-lg text-white"
                type="submit"
                onClick={() => toast}
              >
                Đăng ký
              </Button>
            )}
          </form>
        </Form>
        <p className="font-medium text-center text-lg">Hoặc đăng nhập với</p>
        <Button className="ml-auto w-full text-lg" variant="outline">
          Google
        </Button>
        <p className="font-medium text-center text-lg">
          Bạn đã có tài khoản ?
          <span className="text-primary">
            <Link href={"/login"}> Đăng nhập</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
