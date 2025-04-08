"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/app/api/auth/auth.api";

export default function VerifyPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const params = useParams();
    const { token } = params;

    console.log(token);

    const handleVerify = async () => {
        setIsLoading(true);
        const response = await verifyEmail(token as string);

        if (response.success === true) {
            toast.message(response.message);
            router.push("/Login");
        } else {
            toast.error(response.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Verify your email</h1>
            <p className="text-sm text-gray-500">
                Click the button below to verify your email
            </p>
            <Button disabled={isLoading} onClick={handleVerify}>
                {isLoading ? "Đang xác thực ..." : "Xác thưc"}
            </Button>
        </div>
    );
}
