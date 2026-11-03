import React from "react";
import { CognitionLevelType } from "../../types/exam";
import { notification } from "antd";

interface DifficultySelectorProps {
  selectedLevels: CognitionLevelType[];
  onToggleLevel: (level: CognitionLevelType) => void;
  onApplyMatrixPreset: () => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedLevels,
  onToggleLevel,
  onApplyMatrixPreset,
}) => {
  const levels: {
    id: CognitionLevelType;
    levelName: string;
    levelNum: string;
    targetScore: string;
    desc: string;
    avgTime: string;
    availableCount: string;
    badgeStyle?: string;
  }[] = [
    {
      id: "level-1",
      levelNum: "Mức độ 1",
      levelName: "Nhận biết",
      targetScore: "Cơ bản • Mục tiêu 5.0 - 6.0 điểm",
      desc: "Nhớ định nghĩa, khái niệm sinh học cơ bản: bộ ba mã sao ADN, mã di truyền, các bào quan và quy luật Men-đen thuần túy.",
      avgTime: "~30s / câu",
      availableCount: "1.150 câu",
    },
    {
      id: "level-2",
      levelNum: "Mức độ 2",
      levelName: "Thông hiểu",
      targetScore: "Khá • Mục tiêu 7.0 - 8.0 điểm",
      desc: "Phân biệt cơ chế phiên mã - dịch mã, đọc sơ đồ điều hòa operon Lac, so sánh NST nhân sơ và nhân thực, giải thích các hiện tượng.",
      avgTime: "~50s / câu",
      availableCount: "920 câu",
    },
    {
      id: "level-3",
      levelNum: "Mức độ 3",
      levelName: "Vận dụng",
      targetScore: "Giỏi • Mục tiêu 8.0 - 9.0 điểm",
      desc: "Tính toán liên kết hydro, số nucleotide, xác định kiểu gen F1/F2 quy luật tương tác gen, phả hệ 1 tính trạng bệnh đơn lẻ.",
      avgTime: "~75s / câu",
      availableCount: "430 câu",
    },
    {
      id: "level-4",
      levelNum: "Bứt phá 9.5 - 10.0 Y Dược",
      levelName: "Vận dụng cao",
      targetScore: "Điểm 9+ • Phân hóa thủ khoa",
      desc: "Bài toán tích hợp 2-3 quy luật di truyền, phả hệ liên kết giới tính kết hợp nhóm máu, hoán vị gen 2 giới khác tần số, đột biến lệch bội.",
      avgTime: "~110s / câu",
      availableCount: "250 câu",
      badgeStyle: "bg-accent-amber-surface text-tertiary border border-tertiary-fixed-dim/40",
    },
  ];

  return (
    <section className="bg-surface-card rounded-xl border border-border-hairline p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-5">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-md bg-brand-emerald-surface text-brand-emerald-dark flex items-center justify-center font-label-sm text-label-sm font-bold border border-brand-emerald-light/30">
            3
          </span>
          <div>
            <h2 className="font-headline-md text-headline-md text-text-heading font-semibold">
              Chọn Cấp Độ Nhận Thức (Độ khó)
            </h2>
            <p className="font-body-sm text-body-sm text-text-muted">
              Có thể chọn nhiều cấp độ hoặc chọn nhanh Ma trận phối hợp tổng thể
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            notification.info({
              message: "Cài đặt tỷ lệ",
              description: "Hệ thống đang áp dụng ma trận chuẩn 2025. Bạn có thể bật tắt các cấp độ bên dưới.",
            });
          }}
          className="text-xs font-label-sm text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">tune</span> Cài đặt tỷ lệ %
        </button>
      </div>

      {/* Quick Preset: Ma trận chuẩn Bộ GD&ĐT */}
      <div className="p-3.5 mb-5 rounded-xl bg-surface-canvas border border-border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-primary text-[20px]">
            architecture
          </span>
          <div>
            <span className="font-label-md text-label-md font-bold text-text-heading block">
              Ma trận tổng hợp chuẩn đề thi THPT 2025
            </span>
            <span className="font-body-sm text-xs text-text-muted">
              40% Nhận biết • 30% Thông hiểu • 20% Vận dụng • 10% Vận dụng cao
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onApplyMatrixPreset}
          className="px-3 py-1.5 rounded-lg bg-surface-card text-text-heading font-label-sm text-xs font-semibold border border-border-hairline hover:border-primary hover:text-primary transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer shadow-sm"
        >
          Áp dụng ma trận này
        </button>
      </div>

      {/* 4 Cognition Levels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {levels.map((lvl) => {
          const isSelected = selectedLevels.includes(lvl.id);
          return (
            <div
              key={lvl.id}
              onClick={() => onToggleLevel(lvl.id)}
              className={`p-4 rounded-xl transition-all cursor-pointer relative flex flex-col justify-between select-none ${
                isSelected
                  ? "border-2 border-primary bg-brand-emerald-surface shadow-sm"
                  : "border border-border-hairline bg-surface-card hover:bg-surface-canvas"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2 py-0.5 rounded font-label-sm text-[11px] font-semibold ${
                      isSelected
                        ? lvl.badgeStyle || "bg-primary text-on-primary"
                        : "bg-surface-canvas text-text-muted border border-border-hairline"
                    }`}
                  >
                    {lvl.levelNum} {isSelected && "• Đã chọn"}
                  </span>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                  />
                </div>

                <div className="font-headline-sm text-headline-sm font-bold text-text-heading block">
                  {lvl.levelName}
                </div>
                <span
                  className={`font-label-sm text-xs font-medium block mt-0.5 ${
                    isSelected ? "text-brand-emerald-dark font-semibold" : "text-text-muted"
                  }`}
                >
                  {lvl.targetScore}
                </span>

                <p className="font-body-sm text-xs text-text-body mt-2 leading-relaxed">
                  {lvl.desc}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-caption">
                <span>Thời gian TB: {lvl.avgTime}</span>
                <span className={isSelected ? "font-bold text-text-heading" : ""}>
                  Khả dụng: {lvl.availableCount}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DifficultySelector;

