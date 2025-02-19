import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";

const HomeHeader = () => {
  return (
    <div className="flex justify-between my-3 mx-8 items-center">
      <div>
        <p className="technihongo">TechNihongo</p>
      </div>
      <div />
      <div className="flex gap-x-2">
        <Link href={"/sign-in"}>
          <Button variant={"outline"}>Đăng ký</Button>
        </Link>
        <Link href={"/login"}>
          <Button>Đăng nhập</Button>
        </Link>
      </div>
    </div>
  );
};

export default HomeHeader;
