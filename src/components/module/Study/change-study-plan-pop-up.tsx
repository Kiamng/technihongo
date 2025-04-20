import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { StudyPlan } from "@/types/study-plan";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { switchStudyPlan } from "@/app/api/StudyPlan/study-plan.api";

interface ChangeStudyPlanPopUpProps {
    studyPlans: StudyPlan[];
    studentId: number;
    currentStudyPlanId: number;
    token: string;
    fetchData: () => void;
}

const ChangeStudyPlanPopUp = ({
    studyPlans,
    studentId,
    currentStudyPlanId,
    token,
    fetchData,
}: ChangeStudyPlanPopUpProps) => {
    const [isPending, startTransition] = useTransition();
    const [selectedStudyPlanId, setSelectedStudyPlanId] = useState(
        currentStudyPlanId.toString(),
    );
    const [isAlertOpen, setAlertOpen] = useState(false);

    const handleSaveChanges = () => {
        setAlertOpen(true);
    };

    const handleConfirm = () => {
        console.log("currentStudyPlanId", currentStudyPlanId);
        console.log("selectedStudyPlanId", selectedStudyPlanId);
        console.log("studentId", studentId);

        startTransition(async () => {
            try {
                const response = await switchStudyPlan(
                    token,
                    studentId,
                    Number(selectedStudyPlanId),
                    currentStudyPlanId,
                );

                if (response.success === true) {
                    toast.success("Thay đổi kế hoạch học tập thành công");
                    fetchData();
                }
            } catch (error: any) {
                console.log("error", error);
                toast.error(error.response.data.message);
            } finally {
                setAlertOpen(false);
            }
        });
    };

    const handleCancel = () => {
        setAlertOpen(false);
    };

    const handleRadioChange = (value: string) => {
        setSelectedStudyPlanId(value);
    };

    return (
        <Dialog>
            <DialogTrigger className="text-sm text-primary font-bold p-2 border-[1px] border-primary rounded-lg hover:scale-105 transition-all duration-300">
                Thay đổi
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="w-full">
                    <DialogTitle className="text-primary font-bold text-center text-2xl">
                        Thay đổi kế hoạch học tập
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Chọn 1 kế hoạch học bạn muốn và lưu lại
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-6">
                    <RadioGroup
                        disabled={isPending}
                        value={selectedStudyPlanId}
                        onValueChange={handleRadioChange}
                    >
                        {studyPlans.map((studyPlan) => (
                            <div
                                key={studyPlan.studyPlanId}
                                className="flex items-center space-x-2 p-4 border-[1px] border-primary rounded-lg"
                            >
                                <RadioGroupItem
                                    id={studyPlan.studyPlanId.toString()}
                                    value={studyPlan.studyPlanId.toString()}
                                />
                                <Label
                                    className="text-lg"
                                    htmlFor={studyPlan.studyPlanId.toString()}
                                >
                                    {studyPlan.title}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                <DialogFooter>
                    <Button disabled={isPending} onClick={handleSaveChanges}>
                        Lưu thay đổi
                    </Button>
                </DialogFooter>
            </DialogContent>

            {/* AlertDialog for confirmation */}
            <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này sẽ thay đổi kế hoạch học của khóa học
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending} onClick={handleCancel}>
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction disabled={isPending} onClick={handleConfirm}>
                            {isPending ? (
                                <>
                                    Dang xử lý <Loader2 className="w-4 h-4 animate-spin" />
                                </>
                            ) : (
                                "Xác nhận"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    );
};

export default ChangeStudyPlanPopUp;
