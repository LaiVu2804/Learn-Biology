import React from "react";
import { useNavigate } from "react-router-dom";
import { GradeType, ExamFormatType, CognitionLevelType } from "../../types/exam";
import { notification } from "antd";

interface ConfigSummaryProps {
  grade: GradeType;
  format: ExamFormatType;
  levels: CognitionLevelType[];
}

export const ConfigSummary: React.FC<ConfigSummaryProps> = ({
  grade,
  format,
  levels,
}) => {
  const navigate = useNavigate();

  const getFormatDetails = () => {
    switch (format) {
      case "quiz-15m":
        return { name: "Kiểm tra Nhanh (15 Phút)", questions: "15 câu trắc nghiệm", time: 15 };
      case "midterm-45m":
        return { name: "Kiểm tra 1 Tiết (45 Phút)", questions: "30 câu trắc nghiệm", time: 45 };
      case "mock-50m":
        return { name: "Thi Thử THPTQG & ĐGNL (50 Phút)", questions: "40 câu trắc nghiệm", time: 50 };
      case "deep-practice":
        return { name: "Luyện Chuyên Sâu Từng Dạng", questions: "20 câu phân hóa", time: 60 };
    }
  };

  const formatInfo = getFormatDetails();

  const handleStartExam = () => {
    notification.success({
      message: "Khởi tạo phòng thi thành công!",
      description: `Đang kết nối vào phòng thi ${formatInfo.name} - Lớp ${grade}...`,
      duration: 2,
    });
    navigate("/exam");
  };

  return (
    <div className="space-y-5">
      {/* Summary Manifest Card */}
      <div className="bg-surface-card rounded-xl border border-border-hairline p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3.5 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-text-heading">
              Tóm Tắt Cấu Hình Đề
            </h3>
          </div>
          <span className="font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-brand-emerald-surface text-brand-emerald-dark font-semibold">
            Hợp lệ
          </span>
        </div>

        {/* Selected Metrics Recap */}
        <div className="py-4 space-y-3 font-body-sm text-body-sm">
          <div className="flex items-start justify-between gap-3">
            <span className="text-text-muted">Khối lớp:</span>
            <span className="font-semibold text-text-heading text-right">
              Lớp {grade} (Chương trình GDPT mới)
            </span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <span className="text-text-muted">Kiểu bài thi:</span>
            <span className="font-semibold text-text-heading text-right">
              {formatInfo.name}
            </span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <span className="text-text-muted">Số lượng câu:</span>
            <span className="font-semibold text-text-heading text-right">
              {formatInfo.questions}
            </span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <span className="text-text-muted">Phân bậc nhận thức:</span>
            <div className="text-right flex flex-wrap justify-end gap-1">
              {levels.includes("level-1") && (
                <span className="inline-block px-1.5 py-0.5 rounded text-[11px] bg-surface-canvas text-text-body font-medium">
                  Nhận biết
                </span>
              )}
              {levels.includes("level-2") && (
                <span className="inline-block px-1.5 py-0.5 rounded text-[11px] bg-surface-canvas text-text-body font-medium">
                  Thông hiểu
                </span>
              )}
              {levels.includes("level-3") && (
                <span className="inline-block px-1.5 py-0.5 rounded text-[11px] bg-brand-emerald-surface text-brand-emerald-dark font-medium">
                  Vận dụng
                </span>
              )}
              {levels.includes("level-4") && (
                <span className="inline-block px-1.5 py-0.5 rounded text-[11px] bg-accent-amber-surface text-tertiary font-medium">
                  Vận dụng cao
                </span>
              )}
            </div>
          </div>
          <div className="flex items-start justify-between gap-3 pt-2 border-t border-border-subtle">
            <span className="text-text-muted">Ngân hàng câu khớp:</span>
            <span className="font-bold text-primary font-mono text-[14px]">
              680 câu khả dụng
            </span>
          </div>
        </div>

        {/* Visual Bar Proportion Breakdown */}
        <div className="bg-surface-canvas p-3.5 rounded-lg border border-border-hairline mb-5">
          <div className="flex justify-between items-center text-xs font-label-sm mb-2">
            <span className="text-text-muted font-medium">Tỷ lệ độ khó đã chọn:</span>
            <span className="text-text-heading font-semibold">60% VD • 40% VDC</span>
          </div>
          <div className="w-full h-2 rounded-full bg-border-hairline flex overflow-hidden">
            <div className="bg-primary h-full w-[60%]" title="Vận dụng (60%)"></div>
            <div className="bg-brand-emerald-light h-full w-[40%]" title="Vận dụng cao (40%)"></div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-text-caption mt-2">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
              <span>Vận dụng (18 câu)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-brand-emerald-light inline-block"></span>
              <span>Vận dụng cao (12 câu)</span>
            </div>
          </div>
        </div>

        {/* XP Rewards / Motivation Badge */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent-amber-surface border border-tertiary-fixed-dim/30 mb-5 text-tertiary">
          <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
          <div className="text-xs">
            <span className="font-bold block text-text-heading">Hoàn thành bài thi để nhận:</span>
            <span className="text-tertiary font-semibold">+150 XP Tri Thức</span> và mở khóa chuyên sâu Phả Hệ.
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleStartExam}
            className="w-full py-3 px-4 rounded-lg bg-primary hover:bg-brand-emerald-dark active:bg-on-primary-fixed-variant text-on-primary font-label-md text-label-md font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
          >
            <span>Bắt đầu làm bài kiểm tra ngay</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
          <button
            type="button"
            onClick={() => {
              notification.success({
                message: "Đã lưu mẫu cấu hình",
                description: `Đã lưu cấu hình: Lớp ${grade} - ${formatInfo.name} vào danh sách đề cá nhân.`,
              });
            }}
            className="w-full py-2.5 px-4 rounded-lg bg-surface-card hover:bg-surface-canvas text-text-body font-label-md text-label-md font-semibold border border-border-hairline transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
            <span>Lưu thành cấu hình mẫu</span>
          </button>
        </div>

        <p className="font-body-sm text-[11px] text-text-caption text-center mt-3">
          Hệ thống tự động xáo trộn ngẫu nhiên đề & đáp án theo thuật toán bảo mật BioPrep.
        </p>
      </div>

      {/* Academic Advisor Quick Tips Box */}
      <div className="bg-surface-card rounded-xl border border-border-hairline p-4 flex gap-3 items-start shadow-sm">
        <div className="w-8 h-8 rounded-full bg-brand-emerald-surface text-primary flex items-center justify-center shrink-0 border border-brand-emerald-light/30">
          <span className="material-symbols-outlined text-[18px]">lightbulb</span>
        </div>
        <div>
          <span className="font-label-sm text-xs font-bold text-text-heading block mb-0.5">
            Lời khuyên từ Thầy Cô:
          </span>
          <p className="font-body-sm text-xs text-text-muted leading-relaxed">
            Với đề 45 phút cấp độ Vận dụng cao, hãy dành tối đa <strong className="text-text-heading">15 phút đầu</strong> giải quyết trọn vẹn 18 câu vận dụng lý thuyết trước khi chuyển sang các bài toán tương tác gen phức tạp.
          </p>
        </div>
      </div>

      {/* System Branding / Data store logo stamp */}
      <div className="p-3 bg-surface-canvas rounded-xl border border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/bioprep-logo.png"
            alt="BioPrep Academic Certification"
            className="h-6 w-auto object-contain"
          />
          <span className="font-label-sm text-[11px] font-semibold text-text-muted">
            BioPrep Test Engine 2025
          </span>
        </div>
        <span className="font-mono text-[10px] text-text-caption">
          ID: BIO-EXAM-CFG-724
        </span>
      </div>
    </div>
  );
};

export default ConfigSummary;

