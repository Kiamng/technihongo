import { useRouter } from "next/navigation";

import { useQuiz } from "../providers/quiz-provider";

const QuizLink = ({
    href,
    children,
    className,
}: {
    href: string;
    children: React.ReactNode;
    className?: string; // Thêm prop className
}) => {
    const router = useRouter();
    const { isQuizStarted, isSubmitted } = useQuiz(); // Lấy trạng thái từ context

    const handleLinkClick = (e: React.MouseEvent) => {
        if (isQuizStarted && !isSubmitted) {
            e.preventDefault(); // Ngừng hành động mặc định (chuyển trang)
            alert("Hãy hoàn thành bài kiểm tra của mình !");
        } else {
            router.push(href); // Nếu không có vấn đề gì, chuyển hướng bình thường
        }
    };

    return (
        <button className={className} onClick={handleLinkClick}>
            {children}
        </button>
    );
};

export default QuizLink;
