import React, { useState } from "react";
import AppHeader from "../../components/common/AppHeader";
import AppFooter from "../../components/common/AppFooter";
import GradeSelector from "./GradeSelector";
import FormatSelector from "./FormatSelector";
import DifficultySelector from "./DifficultySelector";
import ConfigSummary from "./ConfigSummary";
import { GradeType, ExamFormatType, CognitionLevelType } from "../../types/exam";
import { notification } from "antd";

export const ExamConfigPage: React.FC = () => {
  const [grade, setGrade] = useState<GradeType>("12");
  const [format, setFormat] = useState<ExamFormatType>("midterm-45m");
  const [levels, setLevels] = useState<CognitionLevelType[]>(["level-3", "level-4"]);

  const handleToggleLevel = (lvl: CognitionLevelType) => {
    setLevels((prev) => {
      if (prev.includes(lvl)) {
        if (prev.length === 1) {
          notification.warning({
            message: "Cần chọn ít nhất 1 cấp độ",
            description: "Đề thi cần có ít nhất một cấp độ nhận thức để tạo câu hỏi!",
          });
          return prev;
        }
        return prev.filter((item) => item !== lvl);
      } else {
        return [...prev, lvl];
      }
    });
  };

  const handleApplyMatrixPreset = () => {
    setLevels(["level-1", "level-2", "level-3", "level-4"]);
    notification.success({
      message: "Đã áp dụng ma trận chuẩn 2025",
      description: "Đã chọn đầy đủ 4 mức độ: Nhận biết (40%), Thông hiểu (30%), Vận dụng (20%), Vận dụng cao (10%).",
    });
  };

  return (
    <div className="bg-surface-canvas font-body-md text-body min-h-screen antialiased flex flex-col justify-between selection:bg-brand-emerald-surface selection:text-brand-emerald-dark">
      {/* HEADER */}
      <AppHeader selectedGrade={grade} onGradeChange={(newGrade) => setGrade(newGrade)} />

      {/* MAIN WIZARD */}
      <main className="w-full pt-16 bg-surface-canvas flex-1">
        <div className="flex flex-col w-full">
          {/* Top Banner / Breadcrumb Tracker */}
          <div className="w-full bg-surface-card border-b border-border-hairline shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-text-caption font-label-sm text-label-sm mb-1.5">
                    <span>Ngân hàng đề thi</span>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-primary font-semibold">Tạo đề thi tùy chỉnh</span>
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-text-heading tracking-tight font-bold">
                    Cấu hình bài luyện tập & kiểm tra Sinh học
                  </h1>
                  <p className="font-body-md text-body-md text-text-muted mt-1">
                    Thiết lập đề thi cá nhân hoá theo mục tiêu chỉ trong 3 bước:{" "}
                    <span className="text-text-heading font-medium">Lớp học</span> →{" "}
                    <span className="text-text-heading font-medium">Kiểu bài kiểm tra</span> →{" "}
                    <span className="text-text-heading font-medium">Cấp độ nhận thức</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-amber-surface border border-tertiary-fixed-dim/40 text-tertiary font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    <span>Ma trận chuẩn Bộ GD&ĐT 2025</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      notification.info({
                        message: "Lịch sử cấu hình",
                        description: "Bạn đã tạo 14 đề kiểm tra trong tuần này với kết quả đạt 88.5% độ chính xác.",
                      });
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-surface-canvas text-text-muted hover:text-text-heading font-label-md text-label-md border border-border-hairline transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">history</span>
                    <span className="hidden sm:inline">Lịch sử cấu hình</span>
                  </button>
                </div>
              </div>

              {/* Stepper Indicator Component */}
              <div className="mt-6 pt-5 border-t border-border-subtle">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
                  {/* Step 1 */}
                  <div className="relative flex items-center gap-3.5 p-3 rounded-xl bg-brand-emerald-surface border border-brand-emerald-light/40">
                    <div className="w-8 h-8 rounded-lg bg-brand-emerald-dark text-on-primary flex items-center justify-center font-label-md text-label-md font-bold shrink-0">
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-label-sm text-[11px] uppercase tracking-wider text-brand-emerald-dark font-bold">
                          Bước 1 • Đã chọn
                        </span>
                        <span className="font-label-sm text-xs font-semibold text-brand-emerald-dark">
                          Lớp {grade}
                        </span>
                      </div>
                      <p className="font-headline-sm text-headline-sm text-text-heading font-semibold truncate">
                        Khối lớp THPT
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex items-center gap-3.5 p-3 rounded-xl bg-surface-card border-2 border-primary shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-label-md text-label-md font-bold shrink-0">
                      2
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-label-sm text-[11px] uppercase tracking-wider text-primary font-bold">
                          Bước 2 • Đang thao tác
                        </span>
                        <span className="inline-flex w-2 h-2 rounded-full bg-brand-emerald-light animate-ping"></span>
                      </div>
                      <p className="font-headline-sm text-headline-sm text-text-heading font-semibold truncate">
                        Kiểu bài & Thời gian
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex items-center gap-3.5 p-3 rounded-xl bg-surface-card border border-border-hairline">
                    <div className="w-8 h-8 rounded-lg bg-surface-canvas text-text-muted flex items-center justify-center font-label-md text-label-md font-bold shrink-0">
                      3
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-label-sm text-[11px] uppercase tracking-wider text-text-caption font-semibold">
                        Bước 3 • Phân bậc ({levels.length} cấp độ)
                      </span>
                      <p className="font-headline-sm text-headline-sm text-text-heading font-semibold truncate">
                        Cấp độ nhận thức
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Wizard Workspace Layout (Split 8 / 4 Grid) */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: Step Panels Flow (8 Cols) */}
              <div className="lg:col-span-8 space-y-8">
                {/* STEP 1: Khối lớp */}
                <GradeSelector selectedGrade={grade} onChange={(g) => setGrade(g)} />

                {/* STEP 2: Kiểu bài kiểm tra */}
                <FormatSelector selectedFormat={format} onChange={(f) => setFormat(f)} />

                {/* STEP 3: Cấp độ nhận thức */}
                <DifficultySelector
                  selectedLevels={levels}
                  onToggleLevel={handleToggleLevel}
                  onApplyMatrixPreset={handleApplyMatrixPreset}
                />
              </div>

              {/* RIGHT COLUMN: Sticky Summary Panel & Launch Action (4 Cols) */}
              <div className="lg:col-span-4 sticky top-20">
                <ConfigSummary grade={grade} format={format} levels={levels} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <AppFooter />
    </div>
  );
};

export default ExamConfigPage;

