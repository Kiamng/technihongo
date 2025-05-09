import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-8">
                    Không tìm thấy trang
                </h2>
                <p className="text-gray-600 mb-8">
                    Xin lỗi, trang bạn đang tìm kiếm không tồn tại.
                </p>
                <Link href="/">
                    <Button>Quay về trang chủ</Button>
                </Link>
            </div>
        </div>
    );
}
