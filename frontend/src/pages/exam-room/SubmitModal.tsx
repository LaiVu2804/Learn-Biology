import React from "react";
import { Link } from "react-router-dom";

interface SubmitModalProps {
  isOpen: boolean;
  isSubmitted: boolean;
  answeredCount: number;
  unansweredCount: number;
  flaggedCount: number;
  score?: number;
  onClose: () => void;
  onConfirmSubmit: () => void;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  isSubmitted,
  answeredCount,
  unansweredCount,
  flaggedCount,
  score = 9.25,
  onClose,
  onConfirmSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-card rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-border-hairline animate-in fade-in zoom-in-95 duration-150">
        {!isSubmitted ? (
          <>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent-amber-surface text-tertiary flex items-center justify-center shrink-0 border border-tertiary-fixed-dim/40">
                <span className="material-symbols-outlined text-[28px]">warning</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-text-heading font-bold">
                  Xác nhận nộp bài?
                </h3>
                <p className="font-body-sm text-body-sm text-text-muted">
                  Thời gian làm bài vẫn còn nhiều. Hãy kiểm tra kỹ các câu cắm cờ.
                </p>
              </div>
            </div>

            <div className="bg-surface-canvas p-3.5 rounded-xl space-y-2 text-body-sm font-body-sm border border-border-hairline">
              <div className="flex justify-between text-text-body">
                <span>Số câu đã trả lời:</span>
                <span className="font-bold text-primary">{answeredCount} / 40 câu</span>
              </div>
              <div className="flex justify-between text-text-body">
                <span>Số câu chưa trả lời:</span>
                <span className="font-bold text-rose-600">{unansweredCount} câu</span>
              </div>
              <div className="flex justify-between text-text-body">
                <span>Số câu đánh dấu xem lại:</span>
                <span className="font-bold text-amber-600">{flaggedCount} câu</span>
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              Sau khi nộp bài, hệ thống BioPrep sẽ khóa bài làm, tự động tính điểm chi tiết, xếp hạng phổ điểm và cung cấp lời giải thích video chuyên sâu từ ban chuyên môn.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg bg-surface-canvas text-text-body hover:bg-surface-container font-label-md text-label-md font-semibold transition-colors border border-border-hairline cursor-pointer"
              >
                Tiếp tục làm bài
              </button>
              <button
                type="button"
                onClick={onConfirmSubmit}
                className="px-5 py-2.5 rounded-lg bg-primary hover:bg-brand-emerald-dark text-on-primary font-label-md text-label-md font-bold transition-colors cursor-pointer shadow-md"
              >
                Xác nhận nộp bài thi
              </button>
            </div>
          </>
        ) : (
          /* RESULT MODAL STATE */
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 rounded-full bg-brand-emerald-surface text-brand-emerald-dark mx-auto flex items-center justify-center border border-emerald-200 shadow-sm">
              <span className="material-symbols-outlined text-[36px]">emoji_events</span>
            </div>

            <div>
              <h3 className="font-headline-lg text-2xl font-bold text-text-heading">
                Chúc mừng bạn đã hoàn thành! 🎉
              </h3>
              <p className="text-sm text-text-muted mt-1">
                Đề Khảo Sát Chất Lượng Sinh Học 2025 - Chuyên ĐH Sư Phạm Hà Nội
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-canvas border border-border-hairline space-y-2">
              <div className="text-xs uppercase tracking-wider text-text-caption font-semibold">
                Điểm số đạt được
              </div>
              <div className="text-4xl font-display font-extrabold text-primary">
                {score.toFixed(2)}{" "}
                <span className="text-base text-text-muted font-normal">/ 10.0</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-emerald-surface text-brand-emerald-dark text-xs font-bold border border-emerald-200">
                <span>Top 4.2% toàn quốc</span> • <span>Đạt chuẩn Y Đa Khoa</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/home"
                className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold hover:bg-brand-emerald-dark transition-colors text-center shadow-sm"
              >
                Trở về cấu hình đề luyện thi
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-surface-canvas text-text-body font-semibold hover:bg-surface-container transition-colors text-center border border-border-hairline cursor-pointer"
              >
                Xem lại bài làm chi tiết
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitModal;

