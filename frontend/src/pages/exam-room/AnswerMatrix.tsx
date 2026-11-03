import React from "react";

interface AnswerMatrixProps {
  totalQuestions?: number;
  currentQuestion: number;
  userAnswers: Record<number, string>;
  flaggedQuestions: Record<number, boolean>;
  onSelectQuestion: (questionNumber: number) => void;
  onSubmitExam: () => void;
}

export const AnswerMatrix: React.FC<AnswerMatrixProps> = ({
  totalQuestions = 40,
  currentQuestion,
  userAnswers,
  flaggedQuestions,
  onSelectQuestion,
  onSubmitExam,
}) => {
  const answeredCount = Object.keys(userAnswers).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;
  const unansweredCount = totalQuestions - answeredCount;

  const questionList = Array.from({ length: totalQuestions }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-6">
      {/* Answer Sheet Matrix (Phiếu Trắc Nghiệm 40 Câu) */}
      <div className="bg-surface-card rounded-xl p-5 flex flex-col gap-4 shadow-sm border border-border-hairline">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm text-text-heading font-bold">
            Phiếu trả lời
          </h3>
          <span className="text-xs text-text-muted">Bấm số để chuyển câu</span>
        </div>

        {/* Legend Bar */}
        <div className="grid grid-cols-3 gap-2 text-xs py-2 bg-surface-canvas p-2.5 rounded-lg border border-border-hairline">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-primary"></span>
            <span className="text-text-body font-medium truncate">
              Đã làm: <strong>{answeredCount}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-accent-amber-surface text-tertiary flex items-center justify-center text-[10px] font-bold border border-tertiary-fixed-dim/30">
              🚩
            </span>
            <span className="text-text-body font-medium truncate">
              Cắm cờ: <strong>{flaggedCount}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-surface-card border border-border-hairline"></span>
            <span className="text-text-body font-medium truncate">
              Chưa làm: <strong>{unansweredCount}</strong>
            </span>
          </div>
        </div>

        {/* 40 Questions Grid (5 columns on desktop) */}
        <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-2 pt-1">
          {questionList.map((num) => {
            const isAnswered = !!userAnswers[num];
            const isFlagged = !!flaggedQuestions[num];
            const isCurrent = currentQuestion === num;

            let btnClasses = "h-9 rounded-md font-label-sm text-label-sm font-bold flex items-center justify-center transition-all cursor-pointer relative ";

            if (isCurrent) {
              btnClasses += "bg-brand-emerald-surface text-primary ring-2 ring-text-heading font-extrabold shadow-sm ";
            } else if (isFlagged) {
              btnClasses += "bg-accent-amber-surface text-tertiary border border-tertiary-fixed-dim/40 hover:opacity-90 ";
            } else if (isAnswered) {
              btnClasses += "bg-primary text-on-primary hover:bg-brand-emerald-dark ";
            } else {
              btnClasses += "bg-surface-canvas text-text-muted border border-border-hairline hover:bg-surface-container hover:text-text-heading ";
            }

            return (
              <button
                key={num}
                type="button"
                onClick={() => onSelectQuestion(num)}
                className={btnClasses}
                title={`Câu ${num}: ${isAnswered ? "Đã trả lời " + userAnswers[num] : "Chưa trả lời"}`}
              >
                {num}
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 text-[11px] leading-none">
                    🚩
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Final Submit Button */}
        <div className="pt-3">
          <button
            type="button"
            onClick={onSubmitExam}
            className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary hover:bg-brand-emerald-dark font-label-md text-label-md font-bold text-center flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
            <span>NỘP BÀI THI & XEM KẾT QUẢ</span>
          </button>
          <p className="text-[11px] text-center text-text-muted mt-2">
            Lưu ý: Bạn vẫn còn <strong className="text-tertiary">{unansweredCount} câu chưa điền</strong> đáp án.
          </p>
        </div>
      </div>

      {/* Academic Assessment Card (Target Medicine Score Track) */}
      <div className="bg-surface-card rounded-xl p-5 flex flex-col gap-3 shadow-sm border border-border-hairline">
        <div className="flex items-center gap-2 text-text-heading font-label-md text-label-md font-bold">
          <span className="material-symbols-outlined text-tertiary text-[20px]">military_tech</span>
          <span>Mục tiêu: Y Đa Khoa - ĐH Y Hà Nội</span>
        </div>
        <div className="p-3 rounded-lg bg-surface-canvas text-xs space-y-1 text-text-muted border border-border-hairline">
          <div className="flex justify-between">
            <span>Điểm hòa mạng an toàn:</span>
            <strong className="text-text-heading font-semibold">9.40 / 10.0</strong>
          </div>
          <div className="flex justify-between">
            <span>Số câu sai tối đa:</span>
            <strong className="text-primary font-semibold">≤ 2 câu (38/40 câu đúng)</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerMatrix;

