import React, { useEffect, useState } from "react";
import { callFetchUsers } from "../../services/api";

export const AdminDashboard: React.FC = () => {
  const [totalUsersCount, setTotalUsersCount] = useState<number>(0);
  const [data, setData] = useState<IAdminOverview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month">("today");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await callFetchUsers("page=1&size=1");
        if (res && res.data && res.data.meta) {
          setTotalUsersCount(res.data.meta.total);
        }
      } catch (err) {
        console.warn("Lỗi khi tải dữ liệu người dùng:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
      {/* Header Section with Filters & Realtime Control */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-card p-6 rounded-xl border border-border-hairline shadow-sm">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 text-text-caption font-label-sm text-xs">
            <span>HỆ THỐNG TRUNG TÂM</span>
            <span>•</span>
            <span className="text-brand-emerald-dark font-medium uppercase tracking-wider">
              REALTIME TELEMETRY
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-text-heading tracking-tight">
            Tổng quan & Thống kê Hệ thống BioPrep
          </h1>
          <p className="font-body-sm text-sm text-text-muted">
            Dữ liệu tập trung phục vụ luyện thi Sinh học THPT Quốc gia & ĐGNL năm học 2024 - 2025
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Filter Segment */}
          <div className="inline-flex p-1 bg-surface-canvas rounded-lg border border-border-hairline text-text-body font-label-md text-xs">
            <button
              onClick={() => setTimeFilter("today")}
              className={`px-3 py-1.5 rounded transition-colors ${timeFilter === "today"
                  ? "bg-surface-card font-semibold text-text-heading border border-border-hairline shadow-sm"
                  : "text-text-muted hover:text-text-heading"
                }`}
              type="button"
            >
              Hôm nay
            </button>
            <button
              onClick={() => setTimeFilter("week")}
              className={`px-3 py-1.5 rounded transition-colors ${timeFilter === "week"
                  ? "bg-surface-card font-semibold text-text-heading border border-border-hairline shadow-sm"
                  : "text-text-muted hover:text-text-heading"
                }`}
              type="button"
            >
              7 ngày qua
            </button>
            <button
              onClick={() => setTimeFilter("month")}
              className={`px-3 py-1.5 rounded transition-colors ${timeFilter === "month"
                  ? "bg-surface-card font-semibold text-text-heading border border-border-hairline shadow-sm"
                  : "text-text-muted hover:text-text-heading"
                }`}
              type="button"
            >
              Tháng này
            </button>
          </div>

          {/* Export PDF/Excel */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-brand-emerald-dark text-on-primary rounded-lg font-label-md text-sm transition-colors border border-brand-emerald-dark shadow-sm cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Xuất báo cáo PDF</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Users */}
        <div className="bg-surface-card p-5 rounded-xl border border-border-hairline flex flex-col justify-between shadow-sm">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex flex-col">
              <span className="font-label-sm text-xs text-text-muted uppercase tracking-wider">
                Tổng người dùng
              </span>
              <span className="font-headline-lg text-2xl sm:text-3xl font-bold text-text-heading tracking-tight mt-1">
                {totalUsersCount > 0 ? totalUsersCount.toLocaleString("vi-VN") : "0"}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center flex-shrink-0 text-primary">
              <span className="material-symbols-outlined text-[22px]">group</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle">
            <div className="flex items-center justify-between font-label-sm text-xs">
              <span className="inline-flex items-center gap-1 text-brand-emerald-dark font-medium bg-brand-emerald-surface px-2 py-0.5 rounded-full border border-outline-variant/30">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                {data?.monthlyUserGrowth || "+12.4% vs tháng trước"}
              </span>
              <span className="text-brand-emerald-dark font-semibold">
                +{data?.todayNewUsers || 342} hôm nay
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1 font-body-sm text-xs text-text-muted">
              <div className="flex flex-col">
                <span className="text-[11px] text-text-caption">Học viên</span>
                <span className="font-semibold text-text-heading">
                  {data ? data.studentCount.toLocaleString("vi-VN") : "49.850"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-text-caption">Giảng viên</span>
                <span className="font-semibold text-text-heading">
                  {data ? data.tutorCount.toLocaleString("vi-VN") : "2.580"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-text-caption">Admin</span>
                <span className="font-semibold text-text-heading">
                  {data?.adminCount || 50}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Exams Taken */}
        <div className="bg-surface-card p-5 rounded-xl border border-border-hairline flex flex-col justify-between shadow-sm">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex flex-col">
              <span className="font-label-sm text-xs text-text-muted uppercase tracking-wider">
                Lượt thi thực hiện
              </span>
              <span className="font-headline-lg text-2xl sm:text-3xl font-bold text-text-heading tracking-tight mt-1">
                {data ? data.totalExamsTaken.toLocaleString("vi-VN") : "1.284.950"}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-accent-amber-surface flex items-center justify-center flex-shrink-0 text-amber-700">
              <span className="material-symbols-outlined text-[22px]">quiz</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle">
            <div className="flex items-center justify-between font-label-sm text-xs">
              <span className="text-text-muted font-normal">
                Hôm nay: <strong className="text-text-heading">{data ? data.todayExamsTaken.toLocaleString("vi-VN") : "18.420"}</strong>
              </span>
              <span className="text-text-muted font-normal">
                Tuần: <strong className="text-text-heading">{data ? data.weeklyExamsTaken.toLocaleString("vi-VN") : "112.500"}</strong>
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="font-label-sm text-xs text-text-caption">
                Điểm trung bình toàn sàn:
              </span>
              <span className="font-label-md text-xs px-2 py-0.5 rounded bg-brand-emerald-surface text-brand-emerald-dark font-bold border border-outline-variant/30">
                {data?.averageScore || "7.24"} / 10
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Pending Moderation */}
        <div className="bg-surface-card p-5 rounded-xl border border-border-hairline flex flex-col justify-between shadow-sm">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex flex-col">
              <span className="font-label-sm text-xs text-text-muted uppercase tracking-wider">
                Đề thi & Chuyên đề chờ duyệt
              </span>
              <span className="font-headline-lg text-xl sm:text-2xl font-bold text-amber-600 tracking-tight mt-1">
                {data?.pendingExams || 38} đề & {data?.pendingOutlines || 14} đề cương
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-600">
              <span className="material-symbols-outlined text-[22px]">pending_actions</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle">
            <div className="flex items-center justify-between font-body-sm text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                5 bộ đề ĐGNL ĐHQG
              </span>
              <span className="text-xs text-amber-700 font-medium">Chờ thẩm định</span>
            </div>
            <button
              className="w-full mt-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-surface-canvas hover:bg-surface-container-low text-primary rounded-lg font-label-sm text-xs border border-border-hairline transition-colors cursor-pointer"
              type="button"
            >
              <span>Xem danh sách duyệt ngay</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Card 4: System Infrastructure */}
        <div className="bg-surface-card p-5 rounded-xl border border-border-hairline flex flex-col justify-between shadow-sm">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex flex-col">
              <span className="font-label-sm text-xs text-text-muted uppercase tracking-wider">
                Tình trạng hạ tầng
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-emerald-light"></span>
                <span className="font-headline-sm text-lg font-bold text-brand-emerald-dark tracking-tight">
                  Ổn định (99.98%)
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-brand-emerald-surface flex items-center justify-center flex-shrink-0 text-brand-emerald-dark">
              <span className="material-symbols-outlined text-[22px]">dns</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 pt-2 border-t border-border-subtle font-body-sm text-xs">
            <div className="flex items-center justify-between text-text-muted">
              <span>
                CPU: <strong className="text-text-heading">{data?.infrastructure?.cpuUsage || "24.6%"}</strong>
              </span>
              <span>
                RAM: <strong className="text-text-heading">{data?.infrastructure?.ramUsage || "8.2 / 16 GB"}</strong>
              </span>
            </div>
            <div className="flex items-center justify-between text-text-muted">
              <span>
                Redis: <strong className="text-brand-emerald-dark">94.2% Hit</strong>
              </span>
              <span className="text-rose-600 font-medium">Ping: {data?.infrastructure?.pingMs || 18}ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Traffic & Exam Sessions Over Time (8 cols) */}
        <div className="lg:col-span-8 bg-surface-card p-6 rounded-xl border border-border-hairline shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-4">
            <div className="flex flex-col">
              <h2 className="font-headline-md text-lg font-bold text-text-heading">
                Lưu lượng truy cập & Lượt thi theo thời gian
              </h2>
              <span className="font-body-sm text-xs text-text-muted">
                Giám sát tải hệ thống và lượng người làm bài thi trực tuyến liên tục
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-label-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
                <span className="text-text-body">Lượt thi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span>
                <span className="text-text-body">CCU Online</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span className="text-text-body">Đăng ký mới</span>
              </div>
            </div>
          </div>

          {/* Metric Highlights Bar */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-surface-canvas rounded-lg border border-border-hairline text-center">
            <div className="flex flex-col">
              <span className="font-label-sm text-[11px] text-text-caption">Đỉnh CCU (Học viên thi đồng thời)</span>
              <span className="font-headline-sm text-sm sm:text-base font-bold text-text-heading">
                3.420 <span className="text-xs text-text-muted font-normal">(lúc 20:30)</span>
              </span>
            </div>
            <div className="flex flex-col border-x border-border-hairline">
              <span className="font-label-sm text-[11px] text-text-caption">Giờ cao điểm làm đề</span>
              <span className="font-headline-sm text-sm sm:text-base font-bold text-brand-emerald-dark">
                19:30 - 22:00
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-[11px] text-text-caption">Thời gian làm bài TB</span>
              <span className="font-headline-sm text-sm sm:text-base font-bold text-text-heading">
                44.8 phút / đề
              </span>
            </div>
          </div>

          {/* Interactive SVG Area Chart */}
          <div className="w-full h-64 relative flex flex-col justify-end pt-4">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 220">
              <defs>
                <linearGradient id="primaryGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#006948" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#006948" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="indigoGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line stroke="#f1f5f9" strokeWidth="1" x1="0" x2="700" y1="40" y2="40" />
              <line stroke="#f1f5f9" strokeWidth="1" x1="0" x2="700" y1="90" y2="90" />
              <line stroke="#f1f5f9" strokeWidth="1" x1="0" x2="700" y1="140" y2="140" />
              <line stroke="#f1f5f9" strokeWidth="1" x1="0" x2="700" y1="190" y2="190" />
              {/* Area 1: Lượt làm bài */}
              <polygon
                fill="url(#primaryGradient)"
                points="0,190 0,160 50,150 110,135 170,140 230,110 290,95 350,115 410,80 470,55 530,30 590,45 650,70 700,90 700,190"
              />
              <polyline
                fill="none"
                points="0,160 50,150 110,135 170,140 230,110 290,95 350,115 410,80 470,55 530,30 590,45 650,70 700,90"
                stroke="#006948"
                strokeWidth="2.5"
              />
              {/* Area 2: CCU Online */}
              <polygon
                fill="url(#indigoGradient)"
                points="0,190 0,180 50,175 110,165 170,170 230,150 290,140 350,155 410,120 470,95 530,65 590,85 650,110 700,130 700,190"
              />
              <polyline
                fill="none"
                points="0,180 50,175 110,165 170,170 230,150 290,140 350,155 410,120 470,95 530,65 590,85 650,110 700,130"
                stroke="#6366f1"
                strokeDasharray="4,4"
                strokeWidth="2"
              />
              {/* Peak Marker */}
              <circle cx="530" cy="30" fill="#006948" r="5" stroke="#ffffff" strokeWidth="2" />
              <circle cx="530" cy="65" fill="#6366f1" r="4" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
            {/* X-Axis Labels */}
            <div className="flex justify-between text-text-caption font-label-sm text-[11px] pt-2 border-t border-border-hairline">
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span className="text-brand-emerald-dark font-bold">20:30 (Peak CCU)</span>
              <span>23:59</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-text-muted font-body-sm text-xs pt-1">
            <span>Khảo sát lưu lượng dựa trên 12 máy chủ API Cluster khu vực APAC-Hanoi</span>
            <span className="text-primary font-semibold flex items-center gap-1 cursor-pointer">
              Đồng bộ dữ liệu thời gian thực <span className="material-symbols-outlined text-[14px]">check_circle</span>
            </span>
          </div>
        </div>

        {/* Right Column: Topic Distribution & Cognitive Mastery (4 cols) */}
        <div className="lg:col-span-4 bg-surface-card p-6 rounded-xl border border-border-hairline shadow-sm flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4">
              <div>
                <h2 className="font-headline-md text-lg font-bold text-text-heading">
                  Phân bố chuyên đề Sinh học
                </h2>
                <span className="font-body-sm text-xs text-text-muted">
                  Top nội dung luyện tập nhiều nhất
                </span>
              </div>
              <span className="material-symbols-outlined text-text-caption text-[22px]">pie_chart</span>
            </div>

            {/* Distribution bars */}
            <div className="flex flex-col gap-3">
              {(data?.topicDistribution || [
                { name: "1. Di truyền học phân tử & Tế bào", percentage: 38, color: "#006948" },
                { name: "2. Quy luật Men-đen & Di truyền phả hệ", percentage: 29, color: "#10b981" },
                { name: "3. Sinh thái học & Quần thể sinh vật", percentage: 18, color: "#6366f1" },
                { name: "4. Sinh học Tế bào & Vi sinh vật", percentage: 15, color: "#f59e0b" },
              ]).map((t, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex justify-between font-label-sm text-xs">
                    <span className="text-text-heading font-medium">{t.name}</span>
                    <span className="font-bold" style={{ color: t.color }}>{t.percentage}%</span>
                  </div>
                  <div className="w-full bg-border-subtle h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${t.percentage}%`, backgroundColor: t.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cognitive Mastery Breakdown */}
          <div className="bg-surface-canvas p-3 rounded-lg border border-border-hairline flex flex-col gap-2">
            <span className="font-label-sm text-xs text-text-muted uppercase tracking-wider">
              Tỷ lệ đạt chuẩn theo mức độ tư duy
            </span>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 bg-surface-card rounded border border-border-hairline flex flex-col">
                <span className="font-label-sm text-[11px] text-text-caption">Nhận biết</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-headline-sm text-base font-bold text-brand-emerald-dark">88%</span>
                  <span className="text-[10px] text-text-muted">Đạt yêu cầu</span>
                </div>
              </div>
              <div className="p-2.5 bg-surface-card rounded border border-border-hairline flex flex-col">
                <span className="font-label-sm text-[11px] text-text-caption">Thông hiểu</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-headline-sm text-base font-bold text-brand-emerald-dark">76%</span>
                  <span className="text-[10px] text-text-muted">Khá</span>
                </div>
              </div>
              <div className="p-2.5 bg-surface-card rounded border border-border-hairline flex flex-col">
                <span className="font-label-sm text-[11px] text-text-caption">Vận dụng</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-headline-sm text-base font-bold text-amber-600">58%</span>
                  <span className="text-[10px] text-text-muted">Trung bình</span>
                </div>
              </div>
              <div className="p-2.5 bg-surface-card rounded border border-border-hairline flex flex-col">
                <span className="font-label-sm text-[11px] text-text-caption">Vận dụng cao (9+)</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-headline-sm text-base font-bold text-rose-600">34%</span>
                  <span className="text-[10px] text-text-muted">Phân hóa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure Telemetry & Error Logs (2-Column Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Infrastructure Gauges (5 cols) */}
        <div className="lg:col-span-5 bg-surface-card p-6 rounded-xl border border-border-hairline shadow-sm flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">memory</span>
              <h2 className="font-headline-md text-lg font-bold text-text-heading">
                Tài nguyên Máy chủ & Database
              </h2>
            </div>
            <span className="font-label-sm text-xs bg-brand-emerald-surface text-brand-emerald-dark px-2 py-0.5 rounded border border-outline-variant/30 font-medium">
              Auto-scaling ON
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between font-label-sm text-xs">
                <span className="text-text-heading font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-emerald-light"></span>
                  App Cluster Kubernetes (EKS Hanoi)
                </span>
                <span className="text-text-muted">6/6 Pods (CPU 28%)</span>
              </div>
              <div className="w-full bg-border-subtle h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full w-[28%]"></div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between font-label-sm text-xs">
                <span className="text-text-heading font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-emerald-light"></span>
                  MySQL Database Read/Write Replicas
                </span>
                <span className="text-text-muted">184/500 Conn • Latency: 4.2ms</span>
              </div>
              <div className="w-full bg-border-subtle h-2 rounded-full overflow-hidden">
                <div className="bg-brand-emerald-dark h-full rounded-full w-[36.8%]"></div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between font-label-sm text-xs">
                <span className="text-text-heading font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-emerald-light"></span>
                  Redis Cache (420.000 Keys in RAM)
                </span>
                <span className="text-text-muted">1.4 / 4 GB (Hit: 94.2%)</span>
              </div>
              <div className="w-full bg-border-subtle h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full w-[35%]"></div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between font-label-sm text-xs">
                <span className="text-text-heading font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-emerald-light"></span>
                  AWS S3 Storage (Đề thi PDF & Media)
                </span>
                <span className="text-text-muted">184 GB / 2 TB (9.2%)</span>
              </div>
              <div className="w-full bg-border-subtle h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full w-[9.2%]"></div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-surface-canvas rounded-lg border border-border-hairline flex items-center justify-between text-xs text-text-muted">
            <span>
              Sao lưu tự động tiếp theo: <strong className="text-text-heading">02:00 sáng mai</strong>
            </span>
            <span className="text-brand-emerald-dark font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">lock</span> SSL/TLS A+
            </span>
          </div>
        </div>

        {/* Right: Technical Error & Audit Logs (7 cols) */}
        <div className="lg:col-span-7 bg-surface-card p-6 rounded-xl border border-border-hairline shadow-sm flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-600 text-[22px]">bug_report</span>
              <h2 className="font-headline-md text-lg font-bold text-text-heading">
                Sự kiện Kỹ thuật & Nhật ký Lỗi (Realtime)
              </h2>
            </div>
            <span className="text-xs text-brand-emerald-dark font-semibold">Tự động giám sát</span>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm text-xs">
              <thead>
                <tr className="text-text-caption font-label-sm border-b border-border-hairline">
                  <th className="pb-2 font-semibold">CẤP ĐỘ</th>
                  <th className="pb-2 font-semibold">MÃ SỰ KIỆN / NGUYÊN NHÂN</th>
                  <th className="pb-2 font-semibold">MODULE</th>
                  <th className="pb-2 font-semibold text-right">THỜI GIAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {(data?.technicalLogs || [
                  { level: "ERROR", code: "ERR_REDIS_TIMEOUT", desc: "Timeout 250ms fetch cached exam key #8912", module: "ExamEngine", time: "2 phút trước" },
                  { level: "WARN", code: "WARN_HIGH_CONCURRENCY", desc: "Lượt nộp bài dồn dập tại phòng thi ĐGNL #04", module: "RoomManager", time: "14 phút trước" },
                  { level: "INFO", code: "INFO_BACKUP_SUCCESS", desc: "Tự động sao lưu snapshot MySQL biology_prod hoàn tất", module: "DBCluster", time: "1 giờ trước" },
                  { level: "INFO", code: "INFO_MODEL_UPDATE", desc: "AI Proctoring model v2.4 kích hoạt thành công", module: "ProctorAI", time: "3 giờ trước" }
                ]).map((log, i) => (
                  <tr key={i} className="hover:bg-surface-canvas transition-colors">
                    <td className="py-2.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${log.level === "ERROR"
                            ? "bg-rose-50 text-rose-600 border-rose-200"
                            : log.level === "WARN"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                      >
                        {log.level}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-text-heading font-medium">
                          {log.code}
                        </span>
                        <span className="text-text-muted text-[11px]">{log.desc}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-text-body font-mono text-[11px]">{log.module}</td>
                    <td className="py-2.5 text-right text-text-caption">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-surface-canvas rounded-lg border border-border-hairline text-right">
            <span className="text-xs text-text-muted">
              Hệ thống lưu trữ Audit Log trong 90 ngày theo tiêu chuẩn An toàn thông tin giáo dục.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

