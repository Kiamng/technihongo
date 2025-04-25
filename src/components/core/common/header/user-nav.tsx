"use client";
import { signOut, useSession } from "next-auth/react";
import { JSX } from "react";
import { Award, CircleUserRound, LogOut } from "lucide-react";

import QuizLink from "../custom/quiz-link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserNav(): JSX.Element | null {
  // Thêm kiểu trả về ở đây
  const { data: session } = useSession();

  if (!session) return null; // Bây giờ TypeScript sẽ hiểu đây là một JSX.Element hoặc null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative h-8 w-8 rounded-full" variant="ghost">
          <Avatar className="h-8 w-8">
            <AvatarImage
              alt={session.user?.name ?? ""}
              src={session.user?.profileImg ?? ""}
            />
            <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent forceMount align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <QuizLink className="w-full flex justify-between" href="/profile">
              <span>Thông tin người dùng</span>
              <CircleUserRound />
            </QuizLink>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <QuizLink
              className="w-full flex justify-between"
              href="/achievement"
            >
              <span>Các thành tựu</span>
              <Award />
            </QuizLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          Đăng xuất
          <DropdownMenuShortcut>
            <LogOut />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
