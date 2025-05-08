import { useEffect, useState } from "react";
import { toast } from "sonner";

import { addNote } from "@/app/api/learning-resource/learning-resource.api";
import EmptyStateComponent from "@/components/core/common/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
interface LearningResourceTabsProps {
  pdfPublicId: string;
  resourceId: number;
  token: string;
}
const LearningResourceTabs = ({
  pdfPublicId,
  resourceId,
  token,
}: LearningResourceTabsProps) => {
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (note.trim() !== "") {
        try {
          const response = await addNote(resourceId, note, token);

          if (response.success) {
            toast.success("Ghi chú đã được lưu");
          } else {
            toast.error("Thất bại trong quá trình lưu ghi chú");
          }
        } catch (error) {
          console.error("Failed to save note:", error);
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [note, resourceId, token]);

  return (
    <Tabs className="w-full" defaultValue="document">
      <TabsList>
        <TabsTrigger className="w-full" value="document">
          Tài liệu
        </TabsTrigger>
        <TabsTrigger className="w-full" value="note">
          Ghi chú
        </TabsTrigger>
      </TabsList>
      <TabsContent className="w-full min-h-[400px]" value="document">
        {pdfPublicId ? (
          <iframe
            className="w-full h-screen border"
            src={pdfPublicId}
            title="pdf review"
          />
        ) : (
          <EmptyStateComponent
            imgageUrl="https://cdni.iconscout.com/illustration/premium/thumb/no-information-found-illustration-download-in-svg-png-gif-file-formats--zoom-logo-document-user-interface-result-pack-illustrations-8944779.png?f=webp"
            message={"Hiện tại vẫn chưa có tài liệu nào"}
            size={300}
          />
        )}
      </TabsContent>
      <TabsContent className="w-full min-h-[400px]" value="note">
        <Textarea
          className="w-full"
          placeholder="Thêm ghi chú tại đây"
          rows={7}
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </TabsContent>
    </Tabs>
  );
};

export default LearningResourceTabs;
