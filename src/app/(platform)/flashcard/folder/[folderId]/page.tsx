import { use } from "react";

import FolderDetail from "@/components/module/Flashcard/folder_item_detail";

interface FolderDetailPageProps {
  params: Promise<{ folderId: string }>;
}

export default function FolderDetailPage({ params }: FolderDetailPageProps) {
  const resolvedParams = use(params);
  const folderId = Number(resolvedParams.folderId);

  return <FolderDetail folderId={folderId} />;
}
