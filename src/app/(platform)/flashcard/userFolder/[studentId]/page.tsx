// src/app/(platform)/flashcard/userFolder/[studentId]/page.tsx

import UserFolderModule from "@/components/module/StudentFolder";

interface UserFolderParams {
  studentId: string;
}

interface UserFolderPageProps {
  params: Promise<UserFolderParams>;
}

// Không cần khai báo NextPage, chỉ cần một async function
export default async function UserFolderPage({ params }: UserFolderPageProps) {
  // Chờ params để lấy giá trị studentId
  const { studentId } = await params;

  return <UserFolderModule studentId={parseInt(studentId)} />;
}
