import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    EmailIcon,
    FacebookIcon,
    LinkedinIcon,
    TwitterIcon,
} from "react-share";
import { Copy, Link2 } from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SharePopupProps {
    onOpen: boolean;
    onClose: (value: boolean) => void;
    contentURL: string;
}
const SharePopup = ({ onOpen, onClose, contentURL }: SharePopupProps) => {
    const baseURL = process.env.NEXT_PUBLIC_URL as string;
    const shareLink = baseURL + contentURL;
    const socialLink = [
        {
            logo: (
                <TwitterShareButton url={shareLink}>
                    <TwitterIcon borderRadius={14} className="h-12 w-12 p-0" />
                </TwitterShareButton>
            ),
            name: "x",
        },
        // {
        //     logo: (
        //         <WhatsappShareButton url={shareLink}>
        //             <WhatsappIcon borderRadius={14} className="h-12 w-12 p-0 " />
        //         </WhatsappShareButton>
        //     ),
        //     name: "WhatsApp",
        // },
        {
            logo: (
                <FacebookShareButton url={shareLink}>
                    <FacebookIcon borderRadius={14} className="h-12 w-12 p-0 " />
                </FacebookShareButton>
            ),
            name: "Facebook",
        },
        // {
        //     logo: (
        //         <RedditShareButton url={shareLink}>
        //             <RedditIcon borderRadius={14} className="h-12 w-12 p-0 " />
        //         </RedditShareButton>
        //     ),
        //     name: "Reddit",
        // },
        {
            logo: (
                <LinkedinShareButton url={shareLink}>
                    <LinkedinIcon borderRadius={14} className="h-12 w-12 p-0 " />
                </LinkedinShareButton>
            ),
            name: "Linkedln",
        },
        // {
        //     logo: (
        //         <TelegramShareButton url={shareLink}>
        //             <TelegramIcon borderRadius={14} className="h-12 w-12 p-0 " />
        //         </TelegramShareButton>
        //     ),
        //     name: "Telegram",
        // },
        {
            logo: (
                <EmailShareButton url={shareLink}>
                    <EmailIcon borderRadius={14} className="h-12 w-12 p-0 " />
                </EmailShareButton>
            ),
            name: "Email",
        },
    ];

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink);
        toast.success("Url coppied to clipboard");
    };

    return (
        <Dialog open={onOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="w-full flex justify-center text-2xl">
                        Chia sẻ bộ flashcard
                    </DialogTitle>
                </DialogHeader>
                <div className="flex pb-10 flex-col gap-y-4">
                    <div className="h-12  cursor-pointer rounded-xl overflow-hidden flex flex-row items-center bg-[#a8b3cf14] px-4">
                        <Link2 className={cn("h-5 w-5 mr-2 text-primary ")} />
                        <div className="flex flex-col flex-1">
                            <button
                                className="border-none hover:opacity-80 px-3 outline-none text-primary shadow-none focus-visible:ring-0 "
                                onClick={handleCopy}
                            >
                                {shareLink}
                            </button>
                        </div>
                        <Button size={"icon"} variant={"ghost"} onClick={handleCopy}>
                            <Copy className="h-5 w-5" />
                        </Button>
                    </div>
                    <p className="font-semibold">Hoặc chia sẻ qua: </p>
                    <div className="flex flex-row flex-wrap gap-2 gap-y-4">
                        {socialLink?.map((data, index) => (
                            <div key={index} className="flex flex-col w-16 items-center">
                                <div className="overflow-hidden rounded-14">{data.logo}</div>
                                <span className="mt-1.5 max-w-16 overflow-hidden overflow-ellipsis text-center text-[11px] text-text-tertiary cursor-pointer">
                                    {data.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SharePopup;
