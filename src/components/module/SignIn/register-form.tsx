"use client";
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { RegisterSchema } from "@/schema/auth/register";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "@/components/ui/label";

const RegisterForm = () => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    try {
      setIsPending(!isPending);
      //call api
      //set sonner
      console.log(values);
    } catch (error) {
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="login-form w-[600px] h-full flex flex-col gap-y-5 px-[25px] py-[75px] rounded-[20px] bg-white">
      <h1 className="text-xl font-extrabold text-center">Đăng ký</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-y-4"
        >
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid w-full max-w-sm items-center gap-1.5 relative">
                    <Label htmlFor="email">Tên</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <User className="w-5 h-5" />
                      </span>
                      <Input
                        type="text"
                        placeholder="Nhập tên tại đây"
                        disabled={isPending}
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
                  <div className="grid w-full max-w-sm items-center gap-1.5 relative">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <Mail className="w-5 h-5" />
                      </span>
                      <Input
                        type="email"
                        placeholder="Nhập email tại đây"
                        disabled={isPending}
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

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid w-full max-w-sm items-center gap-1.5 relative">
                    <Label htmlFor="email">Mật khẩu</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <Lock className="w-5 h-5" />
                      </span>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu tại đây"
                        disabled={isPending}
                        {...field}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400"
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
                  <div className="grid w-full max-w-sm items-center gap-1.5 relative">
                    <Label htmlFor="email">Nhập lại mật khẩu</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <Lock className="w-5 h-5" />
                      </span>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu"
                        disabled={isPending}
                        {...field}
                        className="pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400"
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
              type="submit"
              disabled={isPending}
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lí
            </Button>
          ) : (
            <Button
              className="ml-auto w-full mt-4 text-lg"
              type="submit"
              onClick={() => toast}
            >
              Đăng ký
            </Button>
          )}
        </form>
      </Form>
      <p className="font-medium text-center text-lg">Hoặc đăng nhập với</p>
      <Button variant="outline" className="ml-auto w-full text-lg">
        Google
      </Button>
      <p className="font-medium text-center text-lg">
        Bạn đã có tài khoản ?
        <span className="text-[#57D061]">
          <Link href={"/login"}> Đăng nhập</Link>
        </span>
      </p>
    </div>
  );
};

export default RegisterForm;
