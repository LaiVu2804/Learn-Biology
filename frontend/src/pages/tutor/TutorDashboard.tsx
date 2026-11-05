import React, { useState } from "react";
import { notification } from "antd";

interface TutorDashboardProps {
  onNavigateToQuestions?: () => void;
}

export const TutorDashboard: React.FC<TutorDashboardProps> = ({ onNavigateToQuestions }) => {
  const [data] = useState<ITutorOverview | null>(null);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* 1. Header Chào Mừng & Hành Động Nhanh */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center flex-wrap gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-heading tracking-tight">
              Xin chào {data?.tutorName || "ThS. Nguyễn Mai Linh"} 👋
            </h1>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent-amber-surface text-amber-700 font-label-sm text-xs font-semibold border border-amber-200 shadow-sm">
              <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
              <span>Tác giả Đề thi Xuất sắc 2024-2025</span>
            </span>
          </div>
          <p className="font-body-md text-sm text-text-muted">
            {data?.tutorTitle || "Tổ Sinh học • THPT Chuyên Lê Hồng Phong"} • Phụ trách Chuyên đề Luyện thi Y Dược & ĐGNL 2025
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg bg-surface-card hover:bg-surface-canvas text-text-body font-label-md text-xs border border-border-hairline transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-text-muted">picture_as_pdf</span>
            <span>Xuất báo cáo PDF</span>
          </button>
          <button
            onClick={onNavigateToQuestions}
            className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg bg-surface-card hover:bg-surface-canvas text-text-heading font-label-md text-xs font-semibold border border-border-hairline transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">post_add</span>
            <span>Biên soạn câu hỏi</span>
          </button>
          <button
            onClick={() => {
              notification.info({
                message: "Tạo ma trận đề thi",
                description: "Hệ thống hỗ trợ trộn đề thi trắc nghiệm Sinh học 40 câu tự động theo ma trận Bộ GD&ĐT.",
              });
            }}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-primary hover:bg-brand-emerald-dark text-on-primary font-label-md text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Tạo đề thi mới</span>
          </button>
        </div>
      </div>

      {/* 2. Khối 4 Thẻ KPI Cá Nhân */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-surface-card rounded-xl p-5 border border-border-hairline flex flex-col justify-between gap-3 shadow-sm hover:border-brand-emerald-light/60 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs font-semibold text-text-muted uppercase tracking-wider">
              Tổng đề thi đã đóng góp
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-emerald-surface text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">assignment</span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-text-heading">
                {data?.contributedExams || 18}
              </span>
              <span className="font-label-sm text-xs font-semibold text-brand-emerald-dark bg-brand-emerald-surface px-1.5 py-0.5 rounded">
                {data?.contributedExamsGrowth || "+2 tháng này"}
              </span>
            </div>
            <span className="font-body-sm text-xs text-text-muted">
              {data?.officialExams || 16} đề chính thức • {data?.backupExams || 2} đề dự bị
            </span>
          </div>
          <div className="w-full bg-border-subtle h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: "88%" }}></div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-card rounded-xl p-5 border border-border-hairline flex flex-col justify-between gap-3 shadow-sm hover:border-brand-emerald-light/60 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs font-semibold text-text-muted uppercase tracking-wider">
              Ngân hàng câu hỏi cá nhân
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">strikethrough_s</span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-text-heading">
                {data?.questionBankTotal || 428}
              </span>
              <span className="font-label-sm text-xs text-text-caption">câu hỏi</span>
            </div>
            <span className="font-body-sm text-xs text-text-muted">
              {data?.questionApproved || 312} đã duyệt • {data?.questionActive || 94} đang dùng • {data?.questionDraft || 22} nháp
            </span>
          </div>
          <div className="w-full bg-border-subtle h-1 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: "73%" }}></div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-card rounded-xl p-5 border border-border-hairline flex flex-col justify-between gap-3 shadow-sm hover:border-brand-emerald-light/60 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs font-semibold text-text-muted uppercase tracking-wider">
              Lượt học viên làm bài
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-emerald-surface text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-text-heading">
                {data ? data.studentAttempts.toLocaleString("vi-VN") : "48.650"}
              </span>
              <span className="font-label-sm text-xs font-semibold text-brand-emerald-dark bg-brand-emerald-surface px-1.5 py-0.5 rounded">
                {data?.weeklyAttempts || "+3.420 tuần này"}
              </span>
            </div>
            <span className="font-body-sm text-xs text-text-muted">
              {data?.coverageSchools || "Phủ khắp 28 trường THPT chuyên & trọng điểm"}
            </span>
          </div>
          <div className="w-full bg-border-subtle h-1 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: "92%" }}></div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-card rounded-xl p-5 border border-border-hairline flex flex-col justify-between gap-3 shadow-sm hover:border-brand-emerald-light/60 transition-all">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs font-semibold text-text-muted uppercase tracking-wider">
              Điểm đánh giá đề thi
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">star_rate</span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-bold text-text-heading">
                {data?.ratingScore || "4.92"}
              </span>
              <span className="font-label-md text-xs text-text-caption">/ 5.0</span>
              <span className="text-amber-500 font-label-sm text-xs ml-1">★★★★★</span>
            </div>
            <span className="font-body-sm text-xs text-text-muted">
              Dựa trên {data ? data.ratingFeedbackCount.toLocaleString("vi-VN") : "8.910"} phản hồi học sinh
            </span>
          </div>
          <div className="w-full bg-border-subtle h-1 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: "98%" }}></div>
          </div>
        </div>
      </div>

      {/* 3. Phổ Điểm & Mức Độ Nhận Thức */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (8 cols): Histogram */}
        <div className="lg:col-span-8 bg-surface-card rounded-xl p-6 border border-border-hairline shadow-sm flex flex-col gap-4 justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-hairline">
            <div>
              <h3 className="font-headline-md text-lg font-bold text-text-heading tracking-tight">
                Phổ điểm bài thi tổng hợp
              </h3>
              <p className="font-body-sm text-xs text-text-muted">
                Tổng kết 48.650 lượt làm bài trên tất cả các đề khảo thí của cô Linh
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-brand-emerald-surface text-brand-emerald-dark font-label-sm text-xs font-semibold">
                ĐTB: {data?.averageExamScore || "7.35"}
              </span>
              <span className="px-2.5 py-1 rounded bg-surface-canvas border border-border-hairline text-text-body font-label-sm text-xs font-semibold">
                Giỏi (8.0+): {data?.highScorePercentage || 34.2}%
              </span>
            </div>
          </div>

          {/* Histogram Chart */}
          <div className="w-full pt-2">
            <div className="relative w-full h-56 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-6">
              <div className="absolute inset-x-0 top-6 border-b border-dashed border-border-hairline text-text-caption font-label-sm text-[10px] pl-1">
                40% sinh viên
              </div>
              <div className="absolute inset-x-0 top-24 border-b border-dashed border-border-hairline text-text-caption font-label-sm text-[10px] pl-1">
                20% sinh viên
              </div>

              {/* Bars */}
              {(data?.scoreHistogram || [
                { range: "0 - 3.0", percentage: 1.8 },
                { range: "3.0 - 5.0", percentage: 8.4 },
                { range: "5.0 - 6.5", percentage: 22.5 },
                { range: "6.5 - 8.0", percentage: 33.1 },
                { range: "8.0 - 9.0", percentage: 25.6 },
                { range: "9.0 - 10.0", percentage: 8.6 },
              ]).map((bar, i) => {
                const isHighlight = bar.range.includes("6.5") || bar.range.includes("8.0");
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                    <span className="font-label-sm text-[11px] font-bold text-text-heading">
                      {bar.percentage}%
                    </span>
                    <div
                      className={`w-full rounded-t transition-all ${
                        isHighlight
                          ? "bg-primary group-hover:bg-brand-emerald-dark"
                          : "bg-slate-300 group-hover:bg-slate-400"
                      }`}
                      style={{ height: `${Math.min(bar.percentage * 2.2, 90)}%` }}
                    ></div>
                    <span className="font-label-sm text-xs text-text-muted text-center whitespace-nowrap">
                      {bar.range}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Insight Box */}
          <div className="p-4 rounded-lg bg-surface-canvas border border-border-hairline flex items-start gap-3">
            <div className="p-1 rounded bg-indigo-50 text-indigo-600 shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-xs font-bold text-text-heading">
                  Chẩn đoán Khảo thí AI BioPrep:
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-emerald-surface text-brand-emerald-dark font-semibold">
                  Độ tin cậy 96%
                </span>
              </div>
              <p className="font-body-sm text-xs text-text-body leading-relaxed">
                {data?.aiInsight ||
                  "Học sinh giải quyết rất thuần thục mảng Cơ chế di truyền phân tử & Đột biến gen (tỉ lệ đúng 84.2%). Tuy nhiên, điểm mất nhiều nhất tập trung tại dạng toán Phả hệ liên kết NST giới tính kết hợp hoán vị gen (chỉ 28.4% hoàn thành đúng). Khuyến nghị bổ sung 1 đề chuyên đề củng cố riêng dạng này."}
              </p>
            </div>
          </div>
        </div>

        {/* Right (4 cols): Cognitive Distribution */}
        <div className="lg:col-span-4 bg-surface-card rounded-xl p-6 border border-border-hairline shadow-sm flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border-hairline">
              <h3 className="font-headline-md text-base sm:text-lg font-bold text-text-heading tracking-tight">
                4 Mức độ nhận thức
              </h3>
              <span className="font-label-sm text-xs font-semibold text-text-muted">
                {data?.questionBankTotal || 428} câu
              </span>
            </div>
            <p className="font-body-sm text-xs text-text-muted mt-1.5">
              Chuẩn hoá theo ma trận kỳ thi Tốt nghiệp THPT & ĐHQG TP.HCM
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {(data?.cognitiveDistribution || [
              { level: "Nhận biết", count: 120, percentage: 28 },
              { level: "Thông hiểu", count: 150, percentage: 35 },
              { level: "Vận dụng", count: 108, percentage: 25 },
              { level: "Vận dụng cao (Phân loại)", count: 50, percentage: 12 },
            ]).map((cog, i) => {
              const barColor =
                i === 0
                  ? "bg-slate-400"
                  : i === 1
                  ? "bg-primary"
                  : i === 2
                  ? "bg-indigo-500"
                  : "bg-amber-500";
              return (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-label-md text-text-heading font-medium flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${barColor}`}></span> {cog.level}
                    </span>
                    <span className="font-semibold text-text-body">
                      {cog.count} câu <span className="text-text-muted text-[11px] font-normal">({cog.percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-border-subtle h-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${cog.percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-lg bg-surface-canvas border border-border-hairline text-center">
            <span className="font-label-sm text-[11px] text-text-muted">
              Tỉ lệ phân bổ đạt chuẩn tỷ lệ đề Bộ GD&ĐT (40-30-20-10) với mức độ cân bằng tối ưu.
            </span>
          </div>
        </div>
      </div>

      {/* 4. Bảng Danh Sách Đề Thi Tương Tác Cao */}
      <div className="bg-surface-card rounded-xl border border-border-hairline shadow-sm flex flex-col overflow-hidden">
        <div className="p-5 border-b border-border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-card">
          <div>
            <h3 className="font-headline-md text-base sm:text-lg font-bold text-text-heading tracking-tight">
              Các đề thi có lượt thi & tương tác cao nhất
            </h3>
            <p className="font-body-sm text-xs text-text-muted">
              Danh mục đề thi được thí sinh THPT và các trường đối tác sử dụng nhiều nhất
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-hairline bg-surface-canvas/60 text-text-muted font-label-sm text-xs uppercase tracking-wider">
                <th className="py-3 px-5 font-semibold">Tên đề thi & Khối</th>
                <th className="py-3 px-3 font-semibold text-center">Số câu</th>
                <th className="py-3 px-3 font-semibold text-right">Lượt làm bài</th>
                <th className="py-3 px-3 font-semibold text-center">Điểm TB</th>
                <th className="py-3 px-3 font-semibold text-center">Đúng câu khó (VDC)</th>
                <th className="py-3 px-3 font-semibold text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline font-body-sm text-xs text-text-body">
              {(data?.featuredExams || [
                {
                  code: "BIO-DH-12-02",
                  title: "Đề Khảo sát Chuyên sâu Di truyền & Phả hệ Lớp 12 - Lần 2",
                  tag: "HOT",
                  questions: 40,
                  attempts: 21400,
                  avgScore: 7.4,
                  hardCorrectRate: "31.8%",
                  status: "Đang mở",
                },
                {
                  code: "BIO-OPL-25",
                  title: "Bộ Đề Rèn Toán ADN & Operon Lac 2025",
                  tag: "Mục tiêu 9+",
                  questions: 30,
                  attempts: 15200,
                  avgScore: 6.8,
                  hardCorrectRate: "22.4%",
                  status: "Đang mở",
                },
                {
                  code: "BIO-DGNL-HCM-01",
                  title: "Đề Thi Thử Chuẩn Cấu Trúc ĐGNL ĐHQG TP.HCM (Phần Khoa Học Tự Nhiên)",
                  tag: "ĐGNL 2025",
                  questions: 10,
                  attempts: 12050,
                  avgScore: 8.1,
                  hardCorrectRate: "45.0%",
                  status: "Đã khóa đợt 1",
                },
              ]).map((exam, i) => (
                <tr key={i} className="hover:bg-surface-canvas/50 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-label-md text-xs font-bold text-text-heading hover:text-primary cursor-pointer">
                          {exam.title}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-brand-emerald-surface text-brand-emerald-dark text-[10px] font-semibold">
                          {exam.tag}
                        </span>
                      </div>
                      <span className="text-text-muted text-[11px]">Mã đề: {exam.code}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono">{exam.questions} câu</td>
                  <td className="py-3.5 px-3 text-right font-bold text-text-heading">
                    {exam.attempts.toLocaleString("vi-VN")}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded bg-brand-emerald-surface text-brand-emerald-dark font-semibold">
                      {exam.avgScore} / 10
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center font-semibold text-primary">
                    {exam.hardCorrectRate}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        exam.status === "Đang mở"
                          ? "bg-brand-emerald-surface text-brand-emerald-dark"
                          : "bg-slate-100 text-text-muted"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          exam.status === "Đang mở" ? "bg-emerald-600" : "bg-slate-400"
                        }`}
                      ></span>
                      {exam.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;

