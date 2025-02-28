import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const LandingHeader = () => {
  return (
    <div className="w-full bg-white h-20 py-4 absolute top-0">
      <div className="mx-60">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row space-x-10 items-center">
            <div className="logo h-10 w-10 rounded-full bg-slate-600" />
            <div className="text-xl font-semibold hover:text-primary">
              Tiêu đề
            </div>
            <div className="text-xl font-semibold hover:text-primary">
              Tiêu đề
            </div>
          </div>
          <Link href={"/login"}>
            <Button className="text-white">THAM GIA NGAY</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingHeader;
