import React, { useState } from "react";
import { IExamQuestion } from "../../types/exam";

interface QuestionViewerProps {
  question: IExamQuestion;
  selectedOption: string | null;
  isFlagged: boolean;
  onSelectOption: (optionId: "A" | "B" | "C" | "D") => void;
  onToggleFlag: () => void;
  onPrevQuestion: () => void;
  onNextQuestion: () => void;
}

export const QuestionViewer: React.FC<QuestionViewerProps> = ({
  question,
  selectedOption,
  isFlagged,
  onSelectOption,
  onToggleFlag,
  onPrevQuestion,
  onNextQuestion,
}) => {
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [scratchText, setScratchText] = useState(
    "Áp dụng công thức chọn lọc chống alen lặn:\nq0 = sqrt(0.16) = 0.4.\nq3 = q0 / (1 + 3 * q0) = 0.4 / (1 + 3 * 0.4) = 0.4 / 2.2 = 2/11.\nTỉ lệ hoa trắng thế hệ F3: aa = q3^2 = (2/11)^2 = 4/121 ≈ 3.31%.\n=> Chọn C chính xác."
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Question Viewport Card */}
      <article className="bg-surface-card rounded-xl p-5 sm:p-7 relative shadow-sm border border-border-hairline">
        {/* Meta Pill Header & Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-border-subtle">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-text-heading text-on-primary font-headline-sm text-headline-sm font-bold">
              Câu {question.number} / {question.total}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-accent-amber-surface text-tertiary font-label-sm text-label-sm font-semibold border border-tertiary-fixed-dim/40">
              {question.levelText}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-surface-canvas text-text-muted font-label-sm text-label-sm border border-border-hairline">
              ID: {question.id}
            </span>
          </div>

          {/* Question Utilities */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleFlag}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-semibold transition-colors cursor-pointer ${
                isFlagged
                  ? "bg-accent-amber-surface text-tertiary border border-tertiary-fixed-dim/40 shadow-sm"
                  : "bg-surface-canvas text-text-muted hover:text-text-heading border border-border-hairline"
              }`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: isFlagged ? "'FILL' 1" : "'FILL' 0" }}
              >
                bookmark
              </span>
              <span>{isFlagged ? "Đã cắm cờ xem lại" : "Cắm cờ câu này"}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowScratchpad(!showScratchpad)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-canvas text-text-muted hover:text-text-heading font-label-sm text-label-sm transition-colors cursor-pointer border border-border-hairline"
            >
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
              <span className="hidden sm:inline">Nháp tính</span>
            </button>
          </div>
        </div>

        {/* Section Taxonomy */}
        <div className="flex items-center gap-2 py-4 text-text-muted font-body-sm text-body-sm">
          <span className="material-symbols-outlined text-primary text-[18px]">biotech</span>
          <span>
            Chuyên đề: <strong className="text-text-heading font-semibold">{question.topic}</strong>
          </span>
        </div>

        {/* Question Stem Text */}
        <div className="space-y-4 font-body-lg text-body-lg text-text-heading leading-relaxed">
          {question.stem.map((paragraph, idx) => (
            <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
          ))}
        </div>

        {/* Academic Data Visualization Table */}
        {question.tableData && (
          <div className="my-6 rounded-lg bg-surface-canvas p-4 sm:p-5 border border-border-hairline">
            <div className="flex items-center justify-between pb-3 flex-wrap gap-2">
              <span className="font-label-md text-label-md text-text-heading font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">table_chart</span>
                {question.tableData.title}
              </span>
              <span className="font-code-formula text-xs text-text-muted">
                {question.tableData.note}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead>
                  <tr className="text-text-muted bg-surface-card font-semibold border-b border-border-hairline">
                    {question.tableData.headers.map((h, i) => (
                      <th key={i} className="p-2.5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-hairline text-text-body">
                  {question.tableData.rows.map((r, i) => (
                    <tr
                      key={i}
                      className={r.highlight ? "bg-brand-emerald-surface/50 font-medium" : ""}
                    >
                      <td className="p-2.5 font-bold text-text-heading">{r.col1}</td>
                      <td className="p-2.5 font-code-formula text-primary font-semibold">{r.col2}</td>
                      <td className="p-2.5 font-code-formula text-tertiary font-semibold">{r.col3}</td>
                      <td className="p-2.5 font-code-formula">{r.col4}</td>
                      <td className="p-2.5 font-code-formula font-bold">{r.col5}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Embedded Botanical Genetic Vector Graph Diagram */}
            <div className="mt-4 pt-3 flex flex-col md:flex-row items-center justify-between gap-4 bg-surface-card p-3 rounded-lg border border-border-hairline">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-brand-emerald-surface flex items-center justify-center shrink-0">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 48 48"
                  >
                    <path d="M12 40C12 28 24 24 24 12C24 24 36 28 36 40" strokeLinecap="round" />
                    <path d="M16 28C20 28 24 26 28 26" strokeLinecap="round" />
                    <circle cx="24" cy="12" fill="currentColor" r="4" />
                    <path d="M20 36C22 36 26 36 28 36" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="text-xs">
                  <span className="font-bold text-text-heading block">
                    Mô hình chọn lọc chống lại alen lặn aa:
                  </span>
                  <span className="text-text-muted">
                    Công thức tổng quát sau n thế hệ chọn lọc:{" "}
                    <code className="font-code-formula text-primary font-semibold">
                      qₙ = q₀ / (1 + n × q₀)
                    </code>
                  </span>
                </div>
              </div>
              <span className="shrink-0 px-2 py-1 rounded bg-surface-canvas text-[11px] font-mono text-text-muted border border-border-hairline">
                Chuẩn Bộ GD&ĐT THPT 2025
              </span>
            </div>
          </div>
        )}

        {/* Question Prompt */}
        <div className="pt-2 pb-5 font-body-lg text-body-lg text-text-heading font-semibold">
          {question.prompt}
        </div>

        {/* Radio Options (Interactive Cards) */}
        <fieldset aria-label={`Lựa chọn đáp án câu ${question.number}`} className="space-y-3">
          {question.options.map((opt) => {
            const isChecked = selectedOption === opt.id;
            return (
              <label
                key={opt.id}
                onClick={() => onSelectOption(opt.id)}
                className={`group flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer select-none ${
                  isChecked
                    ? "bg-brand-emerald-surface ring-2 ring-primary shadow-sm"
                    : "bg-surface-canvas hover:bg-surface-container border border-transparent hover:border-border-hairline"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-8 h-8 rounded-lg font-label-md text-label-md font-bold flex items-center justify-center transition-colors ${
                      isChecked
                        ? "bg-primary text-on-primary"
                        : "bg-surface-card text-text-muted group-hover:bg-primary/10 group-hover:text-primary"
                    }`}
                  >
                    {opt.id}
                  </div>
                  <span
                    className={`font-body-md text-body-md ${
                      isChecked
                        ? "text-text-heading font-semibold"
                        : "text-text-heading group-hover:text-primary"
                    } transition-colors`}
                  >
                    {opt.text}
                  </span>
                </div>
                <span
                  className={`material-symbols-outlined text-[20px] transition-colors ${
                    isChecked ? "text-primary" : "text-transparent"
                  }`}
                >
                  check_circle
                </span>
              </label>
            );
          })}
        </fieldset>

        {/* Interactive Scratchpad Drawer */}
        {showScratchpad && (
          <div className="mt-6 p-4 rounded-xl bg-surface-canvas border border-border-hairline">
            <div className="flex items-center justify-between pb-2">
              <span className="font-label-sm text-label-sm font-bold text-text-heading flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  calculate
                </span>
                Bản nháp thí sinh (Lưu trữ tạm thời tại phiên thi)
              </span>
              <button
                type="button"
                onClick={() => setScratchText("")}
                className="text-xs text-rose-600 hover:underline cursor-pointer"
              >
                Xóa nháp
              </button>
            </div>
            <textarea
              rows={4}
              value={scratchText}
              onChange={(e) => setScratchText(e.target.value)}
              placeholder="Gõ các phép tính nhẩm di truyền tại đây..."
              className="w-full p-3 rounded-lg bg-surface-card font-code-formula text-body-sm text-text-heading border border-border-hairline focus:border-primary focus:outline-none placeholder:text-text-caption resize-none"
            />
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="mt-8 pt-5 border-t border-border-subtle flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onPrevQuestion}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-canvas text-text-heading hover:bg-surface-container font-label-md text-label-md font-semibold transition-colors border border-border-hairline cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            <span>Câu trước</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-muted font-body-sm">
            <kbd className="px-2 py-0.5 rounded bg-surface-canvas border border-border-hairline text-[11px] font-mono text-text-heading font-medium">
              Phím 1-4
            </kbd>
            <span>Chọn A-D</span>
          </div>

          <button
            type="button"
            onClick={onNextQuestion}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-brand-emerald-dark font-label-md text-label-md font-semibold transition-colors cursor-pointer shadow-sm"
          >
            <span>Câu tiếp theo</span>
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </article>

      {/* Official Exam Rules / Proctoring Banner */}
      <div className="bg-surface-card rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-border-hairline">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary text-[24px] shrink-0 mt-0.5">
            verified_user
          </span>
          <div>
            <h2 className="font-label-md text-label-md text-text-heading font-bold">
              Chế độ giám sát thi trực tuyến THPT Quốc Gia
            </h2>
            <p className="font-body-sm text-body-sm text-text-muted">
              Không chuyển tab trình duyệt quá 3 lần. Hệ thống tự động khóa bài thi nếu phát hiện vi phạm quy chế.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-xs text-text-muted block">Đường truyền mạng</span>
            <span className="font-label-sm text-label-sm text-brand-emerald-dark font-bold flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald-dark animate-pulse"></span>
              24ms - Rất tốt
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionViewer;

