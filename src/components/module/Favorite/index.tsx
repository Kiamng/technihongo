"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { HeartOff, LoaderCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LearningResourceList } from "@/types/learning-resource";
import {
  getFavoriteLearningResource,
  unSaveLearningResource,
} from "@/app/api/learning-resource/learning-resource.api";
import LoadingAnimation from "@/components/translateOcr/LoadingAnimation";
import EmptyStateComponent from "@/components/core/common/empty-state";

export default function FavoriteModule() {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pendingIds, setPendingIds] = useState<number[]>([]);

  const { data: session } = useSession();
  const [learningResource, setLearningResource] =
    useState<LearningResourceList>();

  const handleUnsave = async (learningResourceId: number) => {
    setPendingIds((prev) => [...prev, learningResourceId]);

    try {
      const response = await unSaveLearningResource(
        learningResourceId,
        session?.user.token as string,
      );

      if (response.success === true) {
        setLearningResource((prev) => ({
          ...prev!,
          content: prev!.content.filter(
            (item) => item.resourceId !== learningResourceId,
          ),
        }));
        toast.success("Đã xóa khỏi yêu thích");
      }
    } catch (error) {
      toast.error("Lỗi khi xóa khỏi yêu thích");
    } finally {
      setPendingIds((prev) => prev.filter((id) => id !== learningResourceId));
    }
  };

  useEffect(() => {
    if (!session?.user.token) {
      return;
    }
    const fetchLearningResource = async () => {
      setIsLoading(true);
      try {
        const data = await getFavoriteLearningResource({
          token: session.user.token,
          pageNo: 0,
          pageSize: 10,
          sortBy: "createdAt",
          sortDir: "desc",
        });

        setLearningResource(data);
      } catch (error) {
        toast.error("Lỗi khi tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningResource();
  }, [session?.user.token]);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex justify-center items-center h-64">
          <LoadingAnimation />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* <div className="bg-[#56D071] rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Video yêu thích</h1>
        <p className="text-sm">
          Danh sách video được bạn đánh dấu vào yêu thích
        </p>
        <div className="mt-4">
          <Input
            className="w-full p-2 rounded-md border border-gray-300 text-black"
            placeholder="🔍 Tìm kiếm với tên video"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {learningResource?.content && learningResource?.content.length > 0 ? (
          learningResource?.content.map((video) => (
            <Card key={video.resourceId} className="p-4">
              {/* <Image
                alt={video.title}
                className="rounded-md w-full h-auto"
                height={100} // Giảm chiều cao hình ảnh
                src={video.imageUrl}
                width={200} // Giảm chiều rộng hình ảnh
              /> */}
              <CardContent className="p-2 flex flex-col space-y-6">
                <div className="flex flex-row justify-between">
                  <h2 className="text-base font-bold mt-2 line-clamp-1">
                    {video.title}
                  </h2>
                  <button
                    disabled={pendingIds.includes(video.resourceId)}
                    onClick={() => handleUnsave(video.resourceId)}
                  >
                    {pendingIds.includes(video.resourceId) ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      <HeartOff className="w-6 h-6 text-red-500" />
                    )}
                  </button>
                </div>
                <Button className="mt-2 w-full bg-[#56D071] hover:bg-green-600 text-sm py-1" />
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-3">
            <EmptyStateComponent
              imgageUrl="https://cdni.iconscout.com/illustration/premium/thumb/no-information-found-illustration-download-in-svg-png-gif-file-formats--zoom-logo-document-user-interface-result-pack-illustrations-8944779.png?f=webp"
              message={"Chưa có video nào được lưu"}
              size={300}
            />
          </div>
        )}
      </div>
    </div>
  );
}
