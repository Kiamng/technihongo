export type StudentFolder = {
  folderId: number;
  studentId: number;
  name: string;
  description: string;
};
export type FolderItem = {
  folderItemId: number;
  folderId: number;
  studentSetId: number;
};
