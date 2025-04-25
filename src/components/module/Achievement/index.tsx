"use client";

import type React from "react";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  type Achievement,
  ConditionType,
  type StudentAchievement,
} from "@/types/achievement";
import {
  getAllAchievements,
  getStudentAchievements,
} from "@/app/api/achievement/achievement.api";

interface AchievementWithStatus extends Achievement {
  achievedAt?: string | null;
}

interface GroupedAchievements {
  [conditionType: string]: AchievementWithStatus[];
}

const DEFAULT_ACHIEVEMENT_IMAGE = "/assets/images/achievement.png";
const INITIAL_DISPLAY_COUNT = 5;

const AchievementPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [groupedAchievements, setGroupedAchievements] =
    useState<GroupedAchievements>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<Record<string, boolean>>({});
  const [selectedAchievement, setSelectedAchievement] =
    useState<AchievementWithStatus | null>(null);
  const [showOnlyAchieved, setShowOnlyAchieved] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("showOnlyAchieved") === "true";
    }

    return false;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [newAchievement, setNewAchievement] =
    useState<AchievementWithStatus | null>(null);

  const groupAchievementsByConditionType = (
    achievements: Achievement[] | null | undefined,
    studentAchievements: StudentAchievement[] | null | undefined,
  ): GroupedAchievements => {
    const groups: Record<string, AchievementWithStatus[]> = {};
    const studentAchMap = new Map<number, string>();

    if (Array.isArray(studentAchievements)) {
      studentAchievements.forEach((sa) => {
        studentAchMap.set(sa.achievement.achievementId, sa.achievedAt);
      });
    }

    if (!Array.isArray(achievements)) return groups;

    for (const item of achievements) {
      const achievementWithStatus: AchievementWithStatus = {
        ...item,
        achievedAt: studentAchMap.get(item.achievementId),
      };

      if (!groups[item.conditionType]) {
        groups[item.conditionType] = [];
      }
      groups[item.conditionType].push(achievementWithStatus);
    }

    for (const key in groups) {
      groups[key].sort(
        (a, b) =>
          (a.displayOrder ?? Number.MAX_SAFE_INTEGER) -
          (b.displayOrder ?? Number.MAX_SAFE_INTEGER),
      );
    }

    return groups;
  };

  const getFriendlyConditionName = (conditionType: string): string => {
    switch (conditionType) {
      case ConditionType.LESSON_COMPLETED:
        return "Hoàn thành bài học";
      case ConditionType.QUIZ_PASSED:
        return "Vượt qua bài kiểm tra";
      case ConditionType.DAYS_STREAK:
        return "Chuỗi ngày liên tiếp";
      case ConditionType.FLASHCARD_COMPLETED:
        return "Hoàn thành flashcard";
      case ConditionType.COURSE_COMPLETE:
        return "Hoàn thành khóa học";
      case ConditionType.CHALLENGE_COMPLETED:
        return "Hoàn thành thử thách";
      default:
        return conditionType;
    }
  };

  const isValidImageUrl = (url: string | null): boolean => {
    if (!url) return false;
    try {
      const parsedUrl = new URL(url);

      return (
        parsedUrl.hostname !== "example.com" && parsedUrl.protocol === "https:"
      );
    } catch {
      return false;
    }
  };

  const toggleShowAll = (conditionType: string) => {
    setShowAll((prev) => ({
      ...prev,
      [conditionType]: !prev[conditionType],
    }));
  };

  const openPopup = (achievement: AchievementWithStatus) => {
    setSelectedAchievement(achievement);
  };

  const closePopup = () => {
    setSelectedAchievement(null);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    achievement: AchievementWithStatus,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPopup(achievement);
    }
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePopup();
    };

    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    localStorage.setItem("showOnlyAchieved", showOnlyAchieved.toString());
  }, [showOnlyAchieved]);

  useEffect(() => {
    const fetchData = async () => {
      if (status === "loading") return;

      if (!session?.user?.token) {
        router.push("/login");

        return;
      }

      const studentId = Number(session?.user?.studentId) || 1;

      try {
        setIsLoading(true);
        setError(null);

        const [allAchievements, studentAchievements] = await Promise.all([
          getAllAchievements(session.user.token),
          getStudentAchievements(session.user.token, Number(studentId)),
        ]);

        setGroupedAchievements(
          groupAchievementsByConditionType(
            allAchievements,
            studentAchievements,
          ),
        );

        const latestAchievement = studentAchievements?.find(
          (sa) => new Date(sa.achievedAt).getTime() > Date.now() - 60000,
        );

        if (latestAchievement) {
          setNewAchievement({
            ...latestAchievement.achievement,
            achievedAt: latestAchievement.achievedAt,
          });
        }
      } catch (error: any) {
        if (error.message.includes("Unauthorized")) {
          setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          router.push("/Login");
        } else {
          setError(error.message || "Không thể tải danh sách thành tích!");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session?.user.token, status, router]);

  useEffect(() => {
    if (newAchievement) {
      toast.success(
        `Chúc mừng! Bạn đã đạt được "${newAchievement.badgeName}"`,
        {
          position: "top-center",
          autoClose: 3000,
        },
      );
    }
  }, [newAchievement]);

  const filteredAchievements = useMemo(() => {
    return Object.entries(groupedAchievements).reduce(
      (acc, [conditionType, achievements]) => {
        const filtered = achievements.filter((ach) => {
          const matchesSearch = ach.badgeName
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const matchesFilter = showOnlyAchieved ? ach.achievedAt : true;

          return matchesSearch && matchesFilter;
        });

        if (filtered.length > 0) {
          acc[conditionType] = filtered;
        }

        return acc;
      },
      {} as GroupedAchievements,
    );
  }, [groupedAchievements, searchTerm, showOnlyAchieved]);

  return (
    <div className="min-h-screen bg-[#F5FFF8] text-gray-900 px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Thành tích</h1>
      </div>

      <div className="mb-6 space-y-4">
        <input
          className="w-full p-2 rounded-lg text-gray-900 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#56D071]"
          placeholder="Tìm kiếm thành tích..."
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label className="inline-flex items-center gap-2 text-sm text-gray-900">
          <input
            checked={showOnlyAchieved}
            className="accent-[#56D071]"
            type="checkbox"
            onChange={() => setShowOnlyAchieved((prev) => !prev)}
          />
          Chỉ hiện thành tích đã đạt
        </label>
      </div>

      {status === "loading" || isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 p-4 rounded-lg animate-pulse"
              >
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2" />
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-1" />
                <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto" />
              </div>
            ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-600">
          {error.includes("đăng nhập") ? (
            <>
              {error}{" "}
              <a className="underline" href="/Login">
                Đăng nhập
              </a>
            </>
          ) : (
            error
          )}
        </p>
      ) : !session?.user?.token ? (
        <p className="text-center text-red-600">
          Vui lòng{" "}
          <a className="underline" href="/Login">
            đăng nhập
          </a>{" "}
          để xem thành tích!
        </p>
      ) : Object.keys(filteredAchievements).length === 0 ? (
        <p className="text-center text-gray-900">
          Chưa có thành tích nào!{" "}
          <a
            className="underline text-[#56D071] hover:text-[#45B060]"
            href="/course"
          >
            Bắt đầu học ngay
          </a>{" "}
          để mở khóa thành tích đầu tiên!
        </p>
      ) : (
        <>
          {Object.entries(filteredAchievements).map(
            ([conditionType, achievements]) => (
              <div key={conditionType} className="mb-10">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  {getFriendlyConditionName(conditionType)}
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 bg-white p-6 rounded-xl shadow-sm">
                  {(showAll[conditionType]
                    ? achievements
                    : achievements.slice(0, INITIAL_DISPLAY_COUNT)
                  ).map((ach) => (
                    <div
                      key={ach.achievementId}
                      aria-label={`Xem chi tiết ${ach.badgeName}`}
                      className={`text-center p-2 rounded-lg transition-all cursor-pointer ${ach.achievedAt
                          ? "bg-[#56D071]/20 border border-[#56D071]"
                          : "bg-gray-200 opacity-70"
                        }`}
                      role="button"
                      tabIndex={0}
                      onClick={() => openPopup(ach)}
                      onKeyDown={(e) => handleKeyDown(e, ach)}
                    >
                      <div className="relative w-16 h-16 mx-auto mb-2">
                        <Image
                          fill
                          alt={ach.badgeName}
                          className={`object-contain ${ach.achievedAt ? "" : "grayscale opacity-60"}`}
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          src={
                            isValidImageUrl(ach.imageURL) && ach.imageURL
                              ? ach.imageURL
                              : DEFAULT_ACHIEVEMENT_IMAGE
                          }
                          onError={(e) =>
                            (e.currentTarget.src = DEFAULT_ACHIEVEMENT_IMAGE)
                          }
                        />
                      </div>
                      <p className="text-sm font-medium text-gray-800">
                        {ach.badgeName}
                      </p>
                      {ach.achievedAt ? (
                        <p className="text-xs text-gray-600">
                          Đạt được:{" "}
                          {new Date(ach.achievedAt).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </p>
                      ) : (
                        <p className="text-xs text-[#56D071]">Chưa đạt</p>
                      )}
                    </div>
                  ))}
                </div>

                {achievements.length > INITIAL_DISPLAY_COUNT && (
                  <div className="text-center mt-4">
                    <button
                      className="px-4 py-2 bg-[#56D071] text-white rounded-lg hover:bg-[#45B060] transition"
                      onClick={() => toggleShowAll(conditionType)}
                    >
                      {showAll[conditionType] ? "Thu gọn" : "Xem tất cả"}
                    </button>
                  </div>
                )}
              </div>
            ),
          )}

          <AnimatePresence>
            {selectedAchievement && (
              <motion.div
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
              >
                <motion.div
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-lg p-6 w-full max-w-md text-center relative"
                  exit={{ scale: 0.8, opacity: 0 }}
                  initial={{ scale: 0.8, opacity: 0 }}
                >
                  <button
                    aria-label="Đóng"
                    className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
                    onClick={closePopup}
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 18L18 6M6 6l12 12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </button>

                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    {selectedAchievement.badgeName}
                  </h3>

                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Image
                      fill
                      alt={selectedAchievement.badgeName}
                      className={`object-contain ${selectedAchievement.achievedAt ? "" : "grayscale opacity-60"}`}
                      loading="lazy"
                      sizes="100vw"
                      src={
                        isValidImageUrl(selectedAchievement.imageURL) &&
                          selectedAchievement.imageURL
                          ? selectedAchievement.imageURL
                          : DEFAULT_ACHIEVEMENT_IMAGE
                      }
                      onError={(e) =>
                        (e.currentTarget.src = DEFAULT_ACHIEVEMENT_IMAGE)
                      }
                    />
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {selectedAchievement.description}
                  </p>

                  {selectedAchievement.achievedAt ? (
                    <p className="text-sm text-gray-500">
                      Đạt được:{" "}
                      {new Date(
                        selectedAchievement.achievedAt,
                      ).toLocaleDateString("vi-VN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  ) : (
                    <p className="text-sm text-[#56D071] font-medium">
                      Chưa đạt
                    </p>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default AchievementPage;
