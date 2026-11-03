import React, { useState } from "react";
import AppHeader from "../../components/common/AppHeader";
import AppFooter from "../../components/common/AppFooter";
import CountdownTimer from "./CountdownTimer";
import QuestionViewer from "./QuestionViewer";
import AnswerMatrix from "./AnswerMatrix";
import SubmitModal from "./SubmitModal";
import { IExamQuestion } from "../../types/exam";
import { notification } from "antd";

// Mock realistic exam questions
const defaultQuestion: IExamQuestion = {
  id: "BIO-2025-Q18",
  number: 18,
  total: 40,
  levelText: "Vận dụng cao (Mục tiêu 8.5 - 9.0+)",
  topic: "Di truyền học quần thể & Cân bằng Hardy - Weinberg",
  stem: [
    "Ở một loài thực vật giao phấn ngẫu nhiên, xét một gen nằm trên nhiễm sắc thể thường có 2 alen: alen <strong>A</strong> quy định hoa đỏ trội hoàn toàn so với alen <strong>a</strong> quy định hoa trắng. Một quần thể ban đầu thế hệ xuất phát (P) đang ở trạng thái cân bằng di truyền có tỉ lệ cây hoa trắng chiếm <strong>16%</strong>.",
    "Do tác động của điều kiện môi trường sống, tất cả các cá thể có kiểu hình hoa trắng đều bị mất khả năng sinh sản (bị chọn lọc tự nhiên đào thải hoàn toàn trước giai đoạn sinh sản). Giả sử không có đột biến mới phát sinh, không có hiện tượng di - nhập gen và sức sống của các cây hoa đỏ là như nhau qua các thế hệ.",
  ],
  tableData: {
    title: "Bảng 1: Biến thiên tần số alen và cấu trúc di truyền qua các thế hệ chọn lọc",
    note: "Định luật Hardy-Weinberg: p²(AA) + 2pq(Aa) + q²(aa) = 1",
    headers: [
      "Thế hệ",
      "Tần số alen A (p)",
      "Tần số alen a (q)",
      "Tỉ lệ kiểu gen tham gia sinh sản",
      "Tỉ lệ cây hoa trắng đời con (q²)",
    ],
    rows: [
      {
        col1: "Thế hệ P (Cân bằng)",
        col2: "0.60",
        col3: "0.40",
        col4: "0.36 AA : 0.48 Aa : (0.16 aa bị loại)",
        col5: "0.16 (16%)",
      },
      {
        col1: "Thế hệ F1 (Sinh sản)",
        col2: "0.714",
        col3: "0.286",
        col4: "3/7 AA : 4/7 Aa",
        col5: "q₁² = (2/7)² ≈ 8.16%",
        highlight: true,
      },
      {
        col1: "Thế hệ F2 (Dự đoán)",
        col2: "p₂ = 1 - q₂",
        col3: "q₂ = q₀ / (1 + 2q₀)",
        col4: "Chu kỳ thụ phấn ngẫu nhiên",
        col5: "Xác định theo câu hỏi",
      },
    ],
  },
  prompt:
    "Theo lý thuyết, tỉ lệ cây hoa trắng (aa) xuất hiện ở thế hệ F3 khi các cây hoa đỏ thụ phấn ngẫu nhiên qua các thế hệ là bao nhiêu?",
  options: [
    { id: "A", text: "1/49 (khoảng 2.04%)" },
    { id: "B", text: "1/36 (khoảng 2.78%)" },
    { id: "C", text: "4/121 (khoảng 3.31%)" },
    { id: "D", text: "4/49 (khoảng 8.16%)" },
  ],
  correctOption: "C",
  explanation:
    "Công thức chọn lọc chống alen lặn qua n thế hệ: qₙ = q₀ / (1 + n × q₀). Với q₀ = √0.16 = 0.4. Sau 3 thế hệ: q₃ = 0.4 / (1 + 3×0.4) = 0.4 / 2.2 = 2/11. Tỉ lệ hoa trắng aa = (2/11)² = 4/121 ≈ 3.31%. Chọn đáp án C.",
};

export const ExamRoomPage: React.FC = () => {
  const [currentQuestionNum, setCurrentQuestionNum] = useState<number>(18);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({
    1: "A",
    2: "C",
    3: "B",
    4: "D",
    6: "A",
    7: "B",
    8: "C",
    9: "A",
    10: "D",
    11: "B",
    12: "C",
    14: "A",
    15: "D",
    16: "B",
    17: "C",
    18: "C", // Active question option C
    19: "A",
    20: "B",
    21: "D",
    22: "C",
    23: "A",
    25: "B",
    26: "D",
    28: "C",
  });

  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({
    5: true,
    13: true,
    18: true,
  });

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle select option
  const handleSelectOption = (optId: "A" | "B" | "C" | "D") => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionNum]: optId,
    }));
  };

  // Toggle flag
  const handleToggleFlag = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestionNum]: !prev[currentQuestionNum],
    }));
  };

  // Prev / Next question navigation
  const handlePrevQuestion = () => {
    if (currentQuestionNum > 1) {
      setCurrentQuestionNum(currentQuestionNum - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionNum < 40) {
      setCurrentQuestionNum(currentQuestionNum + 1);
    }
  };

  // Handle submit confirmation
  const handleConfirmSubmit = () => {
    setIsSubmitted(true);
    notification.success({
      message: "Đã nộp bài thành công!",
      description: "Hệ thống đã tính toán điểm số và xếp hạng của bạn.",
    });
  };

  const currentQuestionData: IExamQuestion = {
    ...defaultQuestion,
    number: currentQuestionNum,
    id: `BIO-2025-Q${currentQuestionNum}`,
  };

  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = 40 - answeredCount;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;

  return (
    <div className="bg-surface-canvas font-body-md text-body min-h-screen antialiased flex flex-col justify-between selection:bg-brand-emerald-surface selection:text-brand-emerald-dark">
      {/* HEADER */}
      <AppHeader />

      {/* SUB-HEADER: Exam Context Bar */}
      <div className="pt-16">
        <section className="bg-surface-card border-b border-border-hairline px-4 sm:px-6 lg:px-8 py-3.5 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-emerald-surface text-brand-emerald-dark font-label-sm text-label-sm font-semibold border border-brand-emerald-light/40">
                <span className="w-2 h-2 rounded-full bg-brand-emerald-dark animate-pulse"></span>
                ĐANG THI THỰC CHIẾN
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-headline-sm text-headline-sm text-text-heading font-bold tracking-tight">
                  Đề Khảo Sát Chất Lượng Sinh Học 2025 - Chuyên ĐH Sư Phạm Hà Nội (Lần 2)
                </h1>
                <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-code-formula text-body-sm font-semibold border border-border-hairline">
                  Mã đề: 218
                </span>
              </div>
            </div>

            {/* Quick Action Controls */}
            <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
              <div className="hidden xl:flex items-center gap-2 bg-surface-canvas px-3 py-1.5 rounded-lg text-text-muted font-body-sm text-body-sm border border-border-hairline">
                <span className="material-symbols-outlined text-brand-emerald-dark text-[18px]">
                  cloud_done
                </span>
                <span>
                  Tự động lưu: <strong className="text-text-heading font-semibold">vừa xong</strong>
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  notification.info({
                    message: "Báo lỗi câu hỏi",
                    description: "Cảm ơn bạn, phản hồi về câu hỏi " + currentQuestionNum + " đã được gửi tới Ban Chuyên Môn.",
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card text-text-muted hover:text-text-heading hover:bg-surface-canvas text-label-md font-label-md transition-colors border border-border-hairline cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">flag</span>
                <span className="hidden sm:inline">Báo lỗi câu</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-brand-emerald-dark text-on-primary hover:bg-primary font-label-md text-label-md font-semibold transition-colors cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">done_all</span>
                <span>Nộp bài sớm</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* MAIN BODY GRID: 8 Cols Question Canvas | 4 Cols Answer Matrix & Clock */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Current Question Interactive Suite (8 Cols) */}
          <div className="lg:col-span-8">
            <QuestionViewer
              question={currentQuestionData}
              selectedOption={userAnswers[currentQuestionNum] || null}
              isFlagged={!!flaggedQuestions[currentQuestionNum]}
              onSelectOption={handleSelectOption}
              onToggleFlag={handleToggleFlag}
              onPrevQuestion={handlePrevQuestion}
              onNextQuestion={handleNextQuestion}
            />
          </div>

          {/* Right Column: Timer, Progress, Answer Grid Matrix (4 Cols) */}
          <aside className="lg:col-span-4 flex flex-col gap-6 sticky top-20">
            <CountdownTimer
              totalQuestions={40}
              answeredCount={answeredCount}
              onTimeUp={() => setIsSubmitModalOpen(true)}
            />

            <AnswerMatrix
              totalQuestions={40}
              currentQuestion={currentQuestionNum}
              userAnswers={userAnswers}
              flaggedQuestions={flaggedQuestions}
              onSelectQuestion={(qNum) => setCurrentQuestionNum(qNum)}
              onSubmitExam={() => setIsSubmitModalOpen(true)}
            />
          </aside>
        </div>
      </main>

      {/* SUBMISSION MODAL */}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        isSubmitted={isSubmitted}
        answeredCount={answeredCount}
        unansweredCount={unansweredCount}
        flaggedCount={flaggedCount}
        score={9.25}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={handleConfirmSubmit}
      />

      {/* FOOTER */}
      <AppFooter />
    </div>
  );
};

export default ExamRoomPage;

