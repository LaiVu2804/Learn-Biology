import React from "react";
import { GradeType } from "../../types/exam";

interface GradeSelectorProps {
  selectedGrade: GradeType;
  onChange: (grade: GradeType) => void;
}

export const GradeSelector: React.FC<GradeSelectorProps> = ({
  selectedGrade,
  onChange,
}) => {
  const grades: {
    id: GradeType;
    title: string;
    badge: string;
    subtitle: string;
    desc: string;
    questionCount: string;
    isPrimary?: boolean;
  }[] = [
    {
      id: "12",
      title: "Lớp 12",
      badge: "Ưu tiên 2K7",
      subtitle: "THPT & ĐGNL 2025",
      desc: "Trọng tâm: Di truyền phân tử, Quy luật Men-đen & tương tác gen, Tiến hóa & Sinh thái học.",
      questionCount: "3.200 câu",
      isPrimary: true,
    },
    {
      id: "11",
      title: "Lớp 11",
      badge: "2K8",
      subtitle: "Sinh học cơ thể",
      desc: "Nền tảng trao đổi chất, hô hấp & quang hợp, cảm ứng, sinh trưởng và sinh sản sinh vật.",
      questionCount: "1.850 câu",
    },
    {
      id: "10",
      title: "Lớp 10",
      badge: "2K9",
      subtitle: "Tế bào & Vi sinh",
      desc: "Thành phần hóa học của tế bào, nguyên phân - giảm phân, chuyển hóa vật chất và virus học.",
      questionCount: "1.400 câu",
    },
  ];

  return (
    <section className="bg-surface-card rounded-xl border border-border-hairline p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-5">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-md bg-brand-emerald-surface text-brand-emerald-dark flex items-center justify-center font-label-sm text-label-sm font-bold border border-brand-emerald-light/30">
            1
          </span>
          <div>
            <h2 className="font-headline-md text-headline-md text-text-heading font-semibold">
              Chọn Khối Lớp Học
            </h2>
            <p className="font-body-sm text-body-sm text-text-muted">
              Lựa chọn chương trình ôn tập tương ứng với mục tiêu niên khóa
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 font-label-sm text-xs font-semibold px-2 py-1 rounded bg-brand-emerald-surface text-brand-emerald-dark">
          <span className="material-symbols-outlined text-[14px]">check_circle</span>
          Đã kích hoạt
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {grades.map((g) => {
          const isSelected = selectedGrade === g.id;
          return (
            <div
              key={g.id}
              onClick={() => onChange(g.id)}
              className={`cursor-pointer relative flex flex-col p-4 rounded-xl transition-all select-none ${
                isSelected
                  ? "border-2 border-primary bg-brand-emerald-surface shadow-sm"
                  : "border border-border-hairline bg-surface-card hover:bg-surface-canvas hover:border-text-caption"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full font-label-sm text-[11px] font-semibold ${
                    isSelected
                      ? "bg-primary text-on-primary"
                      : "bg-surface-canvas text-text-muted border border-border-hairline"
                  }`}
                >
                  {g.badge}
                </span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-primary text-on-primary"
                      : "border border-border-hairline bg-surface-card"
                  }`}
                >
                  {isSelected && (
                    <span className="material-symbols-outlined text-[14px]">done</span>
                  )}
                </div>
              </div>

              <div className="mt-2">
                <span className="font-headline-md text-headline-md font-bold text-text-heading block">
                  {g.title}
                </span>
                <span
                  className={`font-label-sm text-xs font-semibold block mt-0.5 ${
                    isSelected ? "text-primary" : "text-text-muted"
                  }`}
                >
                  {g.subtitle}
                </span>
              </div>

              <p className="font-body-sm text-body-sm text-text-muted mt-2 line-clamp-3">
                {g.desc}
              </p>

              <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between font-label-sm text-[11px] text-text-muted">
                <span>Ngân hàng câu hỏi:</span>
                <span className="font-bold text-text-heading">{g.questionCount}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default GradeSelector;

