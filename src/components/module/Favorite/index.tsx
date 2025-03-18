"use client";

import Image from "next/image";
import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { favoriteVideos } from "@/types/favorite";

export default function FavoriteModule() {
  const [search, setSearch] = useState("");

  // Lọc video theo từ khóa tìm kiếm
  const filteredVideos = favoriteVideos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6">
      <div className="bg-[#56D071] rounded-lg p-6 text-white">
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <Card key={video.id} className="p-4">
              <Image
                alt={video.title}
                className="rounded-md w-full h-auto"
                height={100} // Giảm chiều cao hình ảnh
                src={video.imageUrl}
                width={200} // Giảm chiều rộng hình ảnh
              />
              <CardContent className="p-2">
                <h2 className="text-base font-bold mt-2 line-clamp-1">
                  {video.title}
                </h2>
                <p className="text-xs text-gray-500">{video.stage}</p>
                <div className="mt-1">
                  <span className="bg-gray-200 text-gray-700 px-1 py-0.5 rounded text-xs">
                    {video.isMainCourse ? "Khóa chính" : "Khóa phụ"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{video.status}</p>
                <p className="text-xs text-gray-500">{video.duration}</p>
                <Button className="mt-2 w-full bg-[#56D071] hover:bg-green-600 text-sm py-1" />
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-3">
            Không tìm thấy video nào
          </p>
        )}
      </div>
    </div>
  );
}
