import React from "react";
import { ExamFormatType } from "../../types/exam";

interface FormatSelectorProps {
  selectedFormat: ExamFormatType;
  onChange: (format: ExamFormatType) => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  selectedFormat,
  onChange,
}) => {
  const formats: {
    id: ExamFormatType;
    title: string;
    icon: string;
    badge: string;
    desc: string;
    footerLeft: string;
    footerRight: string;
    badgeColor?: string;
  }[] = [
    {
      id: "quiz-15m",
      title: "Kiểm tra Nhanh 15 Phút",
      icon: "timer",
      badge: "15 Phút • 10-15 câu",
      desc: "Ôn tập củng cố ngay sau bài giảng. Nhận phản hồi đúng/sai tức thì kèm lời giải chi tiết từng câu.",
      footerLeft: "Chấm điểm ngay",
      footerRight: "Khởi động nhanh",
    },
    {
      id: "midterm-45m",
      title: "Kiểm tra 1 Tiết / Giữa Kỳ",
      icon: "assignment",
      badge: "45 Phút • 30 câu",
      desc: "Bao quát 1-2 chuyên đề hoàn chỉnh theo ma trận đề thi chuẩn Bộ GD&ĐT. Đánh giá xếp loại điểm số.",
      footerLeft: "Áp dụng: Di truyền học",
      footerRight: "Thang điểm 10.0",
    },
    {
      id: "mock-50m",
      title: "Thi Thử THPTQG & ĐGNL",
      icon: "workspace_premium",
      badge: "50 Phút • 40 câu",
      desc: "Mô phỏng áp lực phòng thi thật, đồng hồ đếm ngược nghiêm ngặt, tự động khóa bài thi và xếp hạng.",
      footerLeft: "Mức độ phân hóa cao",
      footerRight: "Phòng thi ảo",
    },
    {
      id: "deep-practice",
      title: "Luyện Chuyên Sâu Từng Dạng",
      icon: "biotech",
      badge: "Không giới hạn thời gian",
      desc: "Tập trung rèn giũa các dạng bài tập phân loại: Phả hệ nhiều thế hệ, tương tác gen 9:7, hoán vị gen & xác suất.",
      footerLeft: "Gợi ý hướng giải step-by-step",
      footerRight: "Chuyên đề khó",
    },
  ];

  return (
    <section className="bg-surface-card rounded-xl border border-border-hairline p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-5">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-md bg-brand-emerald-surface text-brand-emerald-dark flex items-center justify-center font-label-sm text-label-sm font-bold border border-brand-emerald-light/30">
            2
          </span>
          <div>
            <h2 className="font-headline-md text-headline-md text-text-heading font-semibold">
              Chọn Kiểu Bài Kiểm Tra Muốn Làm
            </h2>
            <p className="font-body-sm text-body-sm text-text-muted">
              Định hình cấu trúc thời gian và cơ chế tính điểm thích hợp
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 font-label-sm text-xs font-semibold px-2 py-1 rounded bg-accent-amber-surface text-tertiary">
          4 hình thức
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {formats.map((f) => {
          const isSelected = selectedFormat === f.id;
          return (
            <div
              key={f.id}
              onClick={() => onChange(f.id)}
              className={`cursor-pointer relative flex flex-col p-4 rounded-xl transition-all select-none ${
                isSelected
                  ? "border-2 border-primary bg-brand-emerald-surface shadow-sm"
                  : "border border-border-hairline bg-surface-card hover:bg-surface-canvas hover:border-text-caption"
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-brand-emerald-dark text-on-primary"
                      : "bg-surface-canvas text-primary border border-border-hairline"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">{f.icon}</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-label-sm text-[11px] font-semibold ${
                    isSelected
                      ? "bg-primary text-on-primary"
                      : "bg-surface-canvas text-text-muted border border-border-hairline"
                  }`}
                >
                  {f.badge} {isSelected && "• Đang chọn"}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <h3 className="font-headline-sm text-headline-sm font-bold text-text-heading">
                  {f.title}
                </h3>
                {isSelected && (
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    check_circle
                  </span>
                )}
              </div>

              <p className="font-body-sm text-body-sm text-text-muted mt-1.5 flex-1">
                {f.desc}
              </p>

              <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between font-label-sm text-[11px]">
                <span className="text-text-muted">{f.footerLeft}</span>
                <span
                  className={`font-semibold ${
                    isSelected ? "text-brand-emerald-dark font-bold" : "text-primary"
                  }`}
                >
                  {f.footerRight}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FormatSelector;

