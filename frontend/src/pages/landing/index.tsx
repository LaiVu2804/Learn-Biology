import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import { notification } from "antd";

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [leadInput, setLeadInput] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedScoreExam, setSelectedScoreExam] = useState<string | null>(null);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadInput.trim()) return;
    notification.success({
      message: "Đăng ký nhận tài liệu thành công!",
      description: `Bộ tài liệu "50 Công thức giải nhanh Di truyền & 10 Đề thi thử" đã được gửi tới: ${leadInput}`,
      duration: 4,
    });
    setLeadInput("");
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-body flex flex-col selection:bg-brand-emerald-surface selection:text-brand-emerald-dark">
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-border-hairline">
        <div className="h-20 max-w-7xl mx-auto px-margin flex items-center justify-between gap-space-md">
          {/* Brand Logo */}
          <div className="flex items-center gap-space-md shrink-0">
            <Link to="/" className="flex items-center gap-2 group select-none">
              <img
                src="/bioprep-logo.png"
                alt="BioPrep Logo"
                className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
              <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-text-heading group-hover:text-primary transition-colors">
                BioPrep
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-brand-emerald-surface text-brand-emerald-dark font-label-sm text-[11px] font-semibold border border-brand-emerald-light/30">
                Luyện thi THPT 2025
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-space-xs">
            <a
              href="#lo-trinh"
              className="px-3 py-2 rounded-lg font-body-md text-text-muted hover:text-text-heading hover:bg-surface-container-low transition-colors"
            >
              Lộ trình ôn thi
            </a>
            <a
              href="#de-thi-tieu-bieu"
              className="px-3 py-2 rounded-lg font-body-md text-text-muted hover:text-text-heading hover:bg-surface-container-low transition-colors"
            >
              Ngân hàng đề thi
            </a>
            <a
              href="#chuyen-de"
              className="px-3 py-2 rounded-lg font-body-md text-text-muted hover:text-text-heading hover:bg-surface-container-low transition-colors"
            >
              Chuyên đề trọng tâm
            </a>
            <a
              href="#de-thi-tieu-bieu"
              className="px-3 py-2 rounded-lg font-body-md text-text-muted hover:text-text-heading hover:bg-surface-container-low transition-colors"
            >
              Luyện đề bấm giờ
            </a>
            <a
              href="#bang-xep-hang"
              className="px-3 py-2 rounded-lg font-body-md text-text-muted hover:text-text-heading hover:bg-surface-container-low transition-colors"
            >
              Bảng xếp hạng
            </a>
            <a
              href="#cong-dong"
              className="px-3 py-2 rounded-lg font-body-md text-text-muted hover:text-text-heading hover:bg-surface-container-low transition-colors"
            >
              Cộng đồng 2K7
            </a>
          </nav>

          {/* Action Cluster */}
          <div className="flex items-center gap-space-sm shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/home"
                  className="px-3.5 py-2 rounded-lg font-label-md text-label-md bg-brand-emerald-surface text-brand-emerald-dark hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">dashboard</span>
                  <span>Vào học (xin chào {user?.name || "Bạn"})</span>
                </Link>
                <button
                  onClick={() => logout()}
                  title="Đăng xuất"
                  className="p-2 rounded-lg text-text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-space-md py-2 rounded-lg font-label-md text-label-md text-primary hover:bg-brand-emerald-surface transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex items-center px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm"
                >
                  Vào thi thử miễn phí
                </Link>
                <Link
                  to="/login"
                  className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors"
                  aria-label="Cổng tài khoản"
                >
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-text-muted hover:text-text-heading hover:bg-surface-container-low"
              aria-label="Menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-surface-card border-b border-border-hairline px-margin py-4 flex flex-col gap-2">
            <a
              href="#lo-trinh"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-text-heading hover:bg-surface-container-low"
            >
              Lộ trình ôn thi
            </a>
            <a
              href="#chuyen-de"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-text-heading hover:bg-surface-container-low"
            >
              Chuyên đề trọng tâm
            </a>
            <a
              href="#de-thi-tieu-bieu"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-text-heading hover:bg-surface-container-low"
            >
              Ngân hàng đề thi & Luyện đề
            </a>
            <a
              href="#bang-xep-hang"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-text-heading hover:bg-surface-container-low"
            >
              Bảng xếp hạng
            </a>
            <div className="pt-2 border-t border-border-hairline flex flex-col gap-2">
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md"
              >
                Vào thi thử miễn phí
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg border border-border-hairline text-text-heading font-label-md text-label-md"
              >
                Đăng nhập tài khoản
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="w-full pt-20 bg-surface flex-1">
        {/* SECTION 1: HERO */}
        <section className="relative w-full overflow-hidden bg-surface-canvas py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-margin">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-space-xl items-center">
              {/* Left Column: Copy & Actions */}
              <div className="lg:col-span-7 flex flex-col items-start gap-space-md">
                {/* Top Badge */}
                <div className="inline-flex items-center gap-space-xs px-3.5 py-1.5 rounded-full bg-brand-emerald-surface text-brand-emerald-dark font-label-sm text-label-sm border border-emerald-200 shadow-sm">
                  <span
                    className="material-symbols-outlined text-[16px] text-brand-emerald-light"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_awesome
                  </span>
                  <span>Chuẩn chương trình GDPT mới 2025 • Đón đầu kỳ thi Tốt nghiệp THPT & ĐGNL</span>
                </div>

                {/* Main Title */}
                <h1 className="font-display text-display text-text-heading tracking-tight leading-tight">
                  Bứt Phá Điểm <span className="text-primary font-bold">9+ Môn Sinh Học</span> Với Phương Pháp Luyện Đề Thông Minh
                </h1>

                {/* Subtitle */}
                <p className="font-body-lg text-body-lg text-text-muted max-w-2xl leading-relaxed">
                  Hệ thống hơn 15.000+ câu hỏi trắc nghiệm chuẩn cấu trúc, video giải chi tiết từng bước, sơ đồ tư duy tương tác và mô phỏng phả hệ di truyền sinh động cho học sinh lớp 10, 11, 12.
                </p>

                {/* CTA Cluster */}
                <div className="flex flex-wrap items-center gap-space-sm pt-space-xs w-full sm:w-auto">
                  <Link
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-all shadow-md shadow-primary/20 hover:scale-[1.02]"
                  >
                    <span>Bắt đầu luyện đề miễn phí</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </Link>
                  <a
                    href="#de-thi-tieu-bieu"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-lg bg-surface-card text-text-heading font-label-md text-label-md hover:bg-surface-container-low transition-all border border-border-hairline shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[20px] text-primary">play_circle</span>
                    <span>Khám phá đề thi thử 2025</span>
                  </a>
                </div>

                {/* Social Proof */}
                <div className="flex flex-wrap items-center gap-space-md pt-space-sm">
                  <div className="flex -space-x-2 overflow-hidden">
                    <div className="inline-block h-9 w-9 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-xs font-bold border-2 border-surface-card">
                      TĐ
                    </div>
                    <div className="inline-block h-9 w-9 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center text-xs font-bold border-2 border-surface-card">
                      MN
                    </div>
                    <div className="inline-block h-9 w-9 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center text-xs font-bold border-2 border-surface-card">
                      HP
                    </div>
                    <div className="inline-block h-9 w-9 rounded-full bg-surface-container-high text-intellect-indigo flex items-center justify-center text-xs font-bold border-2 border-surface-card">
                      KL
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-tertiary">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined text-[16px] text-amber-500"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      ))}
                      <span className="font-label-sm text-label-sm text-text-heading ml-1 font-bold">4.9/5</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-text-muted">
                      Hơn <strong className="text-text-heading">45.000+</strong> học sinh 2K6, 2K7 đang ôn luyện mỗi ngày
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Showcase with overlay cards */}
              <div className="lg:col-span-5 relative mt-8 lg:mt-0">
                <div className="relative rounded-2xl overflow-hidden bg-surface-card shadow-lg border border-border-hairline">
                  <img
                    alt="Học sinh BioPrep luyện đề Sinh học THPT 2025"
                    className="w-full h-[380px] sm:h-[440px] object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSvA00qUDNGzZZ6HklUDr69OlfZPKUonfGasM9tlCNiR4P2TUA_3vFcMzTFuwbfmgm5DhJh1c4qs1bOHYeSkC2akPGIl6UsjwPhOa1zgeh3JtbLbQyAuZXTdKZ1OdwBAZPDau-RkuE0yxAyyYuWBZOppb4mbgcbwamgD4UioGpzC-MCvZWFhEmqngtrcssfx1j2lpzwbMOBx4vXelyTdy4eHq83St92ubePOFuuf01duEp_A-JRRzBkQ"
                    onError={(e) => {
                      // Fallback gradient if external image fails
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-text-heading/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-on-primary">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-on-primary font-label-sm text-label-sm mb-1.5 border border-white/20">
                      <span className="w-2 h-2 rounded-full bg-brand-emerald-light animate-ping"></span>
                      Đang trực tuyến: 1.280 thí sinh
                    </span>
                    <p className="font-headline-sm text-headline-sm font-semibold">Chuyên đề: Phân tích Quy luật Menđen</p>
                  </div>
                </div>

                {/* Floating Stat Badge 1 (Top Left Overlap) */}
                <div className="absolute -top-4 -left-3 sm:-left-6 bg-surface-card p-3 rounded-xl shadow-md border border-border-hairline flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-amber-surface text-tertiary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-text-muted">Mục tiêu Khối B00</p>
                    <p className="font-label-md text-label-md text-text-heading font-bold">
                      Tỉ lệ đạt 8.5+ là <span className="text-primary font-bold">89.4%</span>
                    </p>
                  </div>
                </div>

                {/* Floating Stat Badge 2 (Bottom Right Overlap) */}
                <div className="hidden sm:flex absolute -bottom-5 -right-4 bg-surface-card p-3 rounded-xl shadow-md border border-border-hairline items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-emerald-surface text-brand-emerald-dark flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">neurology</span>
                  </div>
                  <div>
                    <p className="font-label-sm text-label-sm text-text-muted">Công nghệ AI Chẩn đoán</p>
                    <p className="font-label-md text-label-md text-text-heading font-bold">
                      Bù lỗ hổng kiến thức Realtime
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: QUICK STATS BAR */}
        <section className="w-full bg-surface-card py-8 shadow-sm border-y border-border-hairline">
          <div className="max-w-7xl mx-auto px-margin">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center">
                <p className="font-display text-display text-primary font-bold">15.000+</p>
                <p className="font-body-md text-body-md text-text-muted mt-1 font-medium">Câu hỏi phân loại 4 mức độ</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-display text-display text-secondary font-bold">350+</p>
                <p className="font-body-md text-body-md text-text-muted mt-1 font-medium">Đề thi thử từ Chuyên & Sở GD</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-display text-display text-tertiary font-bold">100%</p>
                <p className="font-body-md text-body-md text-text-muted mt-1 font-medium">Giải chi tiết kèm sơ đồ phả hệ</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-display text-display text-intellect-indigo font-bold">45.000+</p>
                <p className="font-body-md text-body-md text-text-muted mt-1 font-medium">Học sinh toàn quốc tin dùng</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: CORE TOPICS CURRICULUM */}
        <section className="w-full py-16 bg-surface-canvas" id="chuyen-de">
          <div className="max-w-7xl mx-auto px-margin flex flex-col gap-space-xl">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
              <div>
                <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">
                  Khung chương trình GDPT mới
                </span>
                <h2 className="font-headline-lg text-headline-lg text-text-heading mt-1 font-bold">
                  Bản đồ Chuyên đề Trọng tâm Sinh học
                </h2>
                <p className="font-body-md text-body-md text-text-muted mt-1">
                  Bao phủ toàn diện cấu trúc ma trận đề thi Tốt nghiệp THPT 2025 và ĐGNL
                </p>
              </div>
              <Link
                to="/register"
                className="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:text-brand-emerald-dark font-semibold"
              >
                <span>Xem chi tiết toàn bộ 14 chuyên đề</span>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </Link>
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {/* Chuyên đề 1 */}
              <div className="bg-surface-card rounded-xl p-space-lg flex flex-col justify-between hover:translate-y-[-2px] transition-all shadow-sm border border-border-hairline hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-space-md">
                    <span className="w-10 h-10 rounded-lg bg-brand-emerald-surface text-brand-emerald-dark flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">biotech</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-accent-amber-surface text-tertiary font-label-sm text-label-sm font-semibold">
                      Trọng tâm 9+
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-text-heading mb-2 font-bold">
                    Di truyền Phân tử & Tế bào
                  </h3>
                  <p className="font-body-sm text-body-sm text-text-muted mb-4">
                    ADN, ARN, cơ chế dịch mã, đột biến gen, phân bào nguyên phân - giảm phân ứng dụng.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between font-label-sm text-label-sm text-text-muted">
                      <span>Dạng bài đã chuẩn hóa:</span>
                      <span className="font-semibold text-text-heading">45 dạng</span>
                    </div>
                    <div className="flex justify-between font-label-sm text-label-sm text-text-muted">
                      <span>Ngân hàng câu hỏi:</span>
                      <span className="font-semibold text-text-heading">3.200 câu</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-2">
                      <div className="bg-primary h-1.5 rounded-full w-[78%]"></div>
                    </div>
                    <p className="font-body-sm text-body-sm text-text-caption text-right">Phổ điểm TB: 7.8/10</p>
                  </div>
                </div>
                <Link
                  to="/register"
                  className="w-full inline-flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-brand-emerald-surface text-brand-emerald-dark font-label-md text-label-md hover:bg-emerald-100 transition-colors font-semibold"
                >
                  <span>Vào ôn ngay</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>

              {/* Chuyên đề 2 */}
              <div className="bg-surface-card rounded-xl p-space-lg flex flex-col justify-between hover:translate-y-[-2px] transition-all shadow-sm border border-border-hairline hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-space-md">
                    <span className="w-10 h-10 rounded-lg bg-intellect-indigo-surface text-intellect-indigo flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">schema</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-intellect-indigo-surface text-intellect-indigo font-label-sm text-label-sm font-semibold">
                      Vận dụng cao
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-text-heading mb-2 font-bold">
                    Quy luật Di truyền & Phả hệ
                  </h3>
                  <p className="font-body-sm text-body-sm text-text-muted mb-4">
                    Menđen, tương tác gen, hoán vị gen, di truyền liên kết giới tính và bài toán phả hệ phức tạp.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between font-label-sm text-label-sm text-text-muted">
                      <span>Công thức giải nhanh:</span>
                      <span className="font-semibold text-text-heading">68 công thức</span>
                    </div>
                    <div className="flex justify-between font-label-sm text-label-sm text-text-muted">
                      <span>Ngân hàng câu hỏi:</span>
                      <span className="font-semibold text-text-heading">2.800 câu</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-2">
                      <div className="bg-intellect-indigo h-1.5 rounded-full w-[65%]"></div>
                    </div>
                    <p className="font-body-sm text-body-sm text-text-caption text-right">Phổ điểm TB: 6.4/10</p>
                  </div>
                </div>
                <Link
                  to="/register"
                  className="w-full inline-flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-surface-container-low text-text-heading font-label-md text-label-md hover:bg-surface-container transition-colors font-semibold"
                >
                  <span>Vào ôn ngay</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>

              {/* Chuyên đề 3 */}
              <div className="bg-surface-card rounded-xl p-space-lg flex flex-col justify-between hover:translate-y-[-2px] transition-all shadow-sm border border-border-hairline hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-space-md">
                    <span className="w-10 h-10 rounded-lg bg-brand-emerald-surface text-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">forest</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-emerald-surface text-secondary font-label-sm text-label-sm font-semibold">
                      Chống liệt & 8+
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-text-heading mb-2 font-bold">
                    Sinh thái học & Môi trường
                  </h3>
                  <p className="font-body-sm text-body-sm text-text-muted mb-4">
                    Quần thể, quần xã sinh vật, hệ sinh thái, chu trình sinh địa hóa và bảo tồn đa dạng sinh học.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between font-label-sm text-label-sm text-text-muted">
                      <span>Sơ đồ tư duy chu trình:</span>
                      <span className="font-semibold text-text-heading">32 sơ đồ</span>
                    </div>
                    <div className="flex justify-between font-label-sm text-label-sm text-text-muted">
                      <span>Ngân hàng câu hỏi:</span>
                      <span className="font-semibold text-text-heading">1.950 câu</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-2">
                      <div className="bg-secondary h-1.5 rounded-full w-[90%]"></div>
                    </div>
                    <p className="font-body-sm text-body-sm text-text-caption text-right">Phổ điểm TB: 8.4/10</p>
                  </div>
                </div>
                <Link
                  to="/register"
                  className="w-full inline-flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-surface-container-low text-text-heading font-label-md text-label-md hover:bg-surface-container transition-colors font-semibold"
                >
                  <span>Vào ôn ngay</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>

              {/* Chuyên đề 4 */}
              <div className="bg-surface-card rounded-xl p-space-lg flex flex-col justify-between hover:translate-y-[-2px] transition-all shadow-sm border border-border-hairline hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-space-md">
                    <span className="w-10 h-10 rounded-lg bg-accent-amber-surface text-tertiary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">history_edu</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-accent-amber-surface text-tertiary font-label-sm text-label-sm font-semibold">
                      Thực tiễn 2025
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-text-heading mb-2 font-bold">
                    Tiến hóa & Công nghệ Sinh
                  </h3>
                  <p className="font-body-sm text-body-sm text-text-muted mb-4">
                    Bằng chứng tiến hóa, học thuyết tiến hóa tổng hợp hiện đại và ứng dụng tế bào - gen thế hệ mới.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between font-label-sm text-label-sm text-text-muted">
                      <span>Bộ câu hỏi bối cảnh thực:</span>
                      <span className="font-semibold text-text-heading">24 bài đọc</span>
                    </div>
                    <div className="flex justify-between font-label-sm text-label-sm text-text-muted">
                      <span>Ngân hàng câu hỏi:</span>
                      <span className="font-semibold text-text-heading">1.400 câu</span>
                    </div>
                    <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-2">
                      <div className="bg-tertiary h-1.5 rounded-full w-[82%]"></div>
                    </div>
                    <p className="font-body-sm text-body-sm text-text-caption text-right">Phổ điểm TB: 7.6/10</p>
                  </div>
                </div>
                <Link
                  to="/register"
                  className="w-full inline-flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-surface-container-low text-text-heading font-label-md text-label-md hover:bg-surface-container transition-colors font-semibold"
                >
                  <span>Vào ôn ngay</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: WHY BIOPREP (KEY FEATURES BENTO) */}
        <section className="w-full py-16 bg-surface" id="lo-trinh">
          <div className="max-w-7xl mx-auto px-margin flex flex-col gap-space-xl">
            <div className="text-center max-w-3xl mx-auto">
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">
                Giải pháp học tập 4.0
              </span>
              <h2 className="font-headline-lg text-headline-lg text-text-heading mt-1 font-bold">
                Tính Năng Vượt Trội Giúp Bạn Bứt Phá Điểm Số
              </h2>
              <p className="font-body-md text-body-md text-text-muted mt-2">
                Không còn học vẹt thụ động. BioPrep trang bị bộ công cụ tư duy trực quan giúp bạn nắm chắc bản chất sinh học từ mức độ Nhận biết đến Vận dụng cao.
              </p>
            </div>

            {/* Bento Grid 4 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {/* Feature 1 */}
              <div className="bg-surface-card rounded-2xl p-space-xl flex flex-col sm:flex-row gap-space-lg items-start border border-border-hairline shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-brand-emerald-surface text-brand-emerald-dark flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[32px]">family_history</span>
                </div>
                <div className="flex-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-emerald-surface text-brand-emerald-dark font-label-sm text-label-sm mb-2 inline-block font-semibold">
                    Độc quyền BioPrep
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-text-heading mb-2 font-bold">
                    Mô phỏng Phả hệ & Bài tập lai tương tác
                  </h3>
                  <p className="font-body-md text-body-md text-text-muted leading-relaxed">
                    Biến các bài toán phả hệ phức tạp thành sơ đồ cây tương tác. Hệ thống tự động phân tích kiểu gen của từng thế hệ F1, F2, F3 giúp bạn nhận diện tức thì bệnh do gen trội hay gen lặn nằm trên NST thường hay giới tính.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-surface-card rounded-2xl p-space-xl flex flex-col sm:flex-row gap-space-lg items-start border border-border-hairline shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-accent-amber-surface text-tertiary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[32px]">timer</span>
                </div>
                <div className="flex-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-accent-amber-surface text-tertiary font-label-sm text-label-sm mb-2 inline-block font-semibold">
                    Chuẩn áp lực thi cử
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-text-heading mb-2 font-bold">
                    Phòng thi bấm giờ chuẩn quy chế Bộ GD&ĐT
                  </h3>
                  <p className="font-body-md text-body-md text-text-muted leading-relaxed">
                    Trải nghiệm phòng thi thật với đồng hồ đếm ngược 50 phút/40 câu hỏi. Hệ thống tự động cảnh báo câu chưa làm, lưu bài khi mất kết nối mạng và trả điểm kèm bảng xếp hạng toàn quốc sau 3 giây.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-surface-card rounded-2xl p-space-xl flex flex-col sm:flex-row gap-space-lg items-start border border-border-hairline shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-intellect-indigo-surface text-intellect-indigo flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[32px]">insights</span>
                </div>
                <div className="flex-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-intellect-indigo-surface text-intellect-indigo font-label-sm text-label-sm mb-2 inline-block font-semibold">
                    Trợ lý AI 24/7
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-text-heading mb-2 font-bold">
                    Chẩn đoán lỗ hổng kiến thức thông minh
                  </h3>
                  <p className="font-body-md text-body-md text-text-muted leading-relaxed">
                    AI chỉ rõ bạn đang mất điểm vì lý do gì: 'Bẫy từ ngữ câu phủ định', 'Nhầm lẫn pha S và pha M' hay 'Tính sai tỉ lệ giao tử hoán vị'. Từ đó đề xuất lộ trình 5 ngày vá đúng phần kiến thức còn hổng.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="bg-surface-card rounded-2xl p-space-xl flex flex-col sm:flex-row gap-space-lg items-start border border-border-hairline shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-surface-container-high text-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[32px]">style</span>
                </div>
                <div className="flex-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-low text-secondary font-label-sm text-label-sm mb-2 inline-block font-semibold">
                    Ghi nhớ x3 tốc độ
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-text-heading mb-2 font-bold">
                    Kho Flashcard & Sơ đồ tư duy Mindmap
                  </h3>
                  <p className="font-body-md text-body-md text-text-muted leading-relaxed">
                    Bộ 650+ thẻ Flashcard điện tử và Mindmap chuẩn màu sắc sinh học cho các chu trình Canvin, pha sáng - pha tối, chuỗi thức ăn, chu trình nito, giúp não bộ ghi nhớ bền vững trước ngày thi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: FEATURED MOCK EXAMS */}
        <section className="w-full py-16 bg-surface-canvas" id="de-thi-tieu-bieu">
          <div className="max-w-7xl mx-auto px-margin flex flex-col gap-space-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
              <div>
                <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">
                  Phòng thi trực tuyến
                </span>
                <h2 className="font-headline-lg text-headline-lg text-text-heading mt-1 font-bold">
                  Đề Thi Thử Tiêu Biểu Đang Diễn Ra
                </h2>
                <p className="font-body-md text-body-md text-text-muted mt-1">
                  Cập nhật liên tục đề thi thử từ các trường Chuyên, Sở Giáo dục và Đề phát triển mới nhất
                </p>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-emerald-surface text-brand-emerald-dark font-label-sm text-label-sm border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-brand-emerald-light animate-pulse"></span>
                  Phòng thi mở 24/7
                </span>
              </div>
            </div>

            {/* Exam List (Cards) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
              {/* Exam Card 1 */}
              <div className="bg-surface-card rounded-2xl p-space-lg flex flex-col justify-between hover:translate-y-[-2px] transition-all shadow-sm border border-border-hairline hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-accent-amber-surface text-tertiary font-label-sm text-label-sm font-semibold">
                      Đề Khảo Sát
                    </span>
                    <span className="flex items-center gap-1 text-text-muted font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      12.430 lượt thi
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-text-heading line-clamp-2 mb-2 font-bold">
                    Đề khảo sát chất lượng Sinh học 2025 - Chuyên ĐH Sư Phạm Hà Nội
                  </h3>
                  <p className="font-body-sm text-body-sm text-text-muted mb-4">
                    Cấu trúc phân hóa rõ nét ở 8 câu vận dụng cao về liên kết gen và phả hệ di truyền người.
                  </p>
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-surface-canvas mb-4">
                    <div>
                      <p className="font-body-sm text-body-sm text-text-muted">Thời gian & Số câu</p>
                      <p className="font-label-md text-label-md text-text-heading font-semibold">50 phút • 40 câu</p>
                    </div>
                    <div>
                      <p className="font-body-sm text-body-sm text-text-muted">Điểm trung bình</p>
                      <p className="font-label-md text-label-md text-primary font-bold">7.2 / 10</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Link
                    to="/login"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                    <span>Làm bài ngay</span>
                  </Link>
                  <button
                    onClick={() => setSelectedScoreExam("Đề Chuyên ĐH Sư Phạm: 12.430 lượt, Điểm TB 7.2")}
                    className="px-3 py-2.5 rounded-lg bg-surface-container-low text-text-muted hover:text-text-heading font-label-md text-label-md transition-colors"
                    title="Xem phổ điểm"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">bar_chart</span>
                  </button>
                </div>
              </div>

              {/* Exam Card 2 */}
              <div className="bg-surface-card rounded-2xl p-space-lg flex flex-col justify-between hover:translate-y-[-2px] transition-all shadow-sm border border-border-hairline hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-emerald-surface text-brand-emerald-dark font-label-sm text-label-sm font-semibold">
                      Chuyên Lam Sơn
                    </span>
                    <span className="flex items-center gap-1 text-text-muted font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      9.850 lượt thi
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-text-heading line-clamp-2 mb-2 font-bold">
                    Đề thi thử Tốt nghiệp THPT đợt 1 - Chuyên Lam Sơn Thanh Hóa
                  </h3>
                  <p className="font-body-sm text-body-sm text-text-muted mb-4">
                    Đề rèn kỹ năng đọc bảng số liệu sinh thái và thí nghiệm sinh học tế bào thực nghiệm mới.
                  </p>
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-surface-canvas mb-4">
                    <div>
                      <p className="font-body-sm text-body-sm text-text-muted">Thời gian & Số câu</p>
                      <p className="font-label-md text-label-md text-text-heading font-semibold">50 phút • 40 câu</p>
                    </div>
                    <div>
                      <p className="font-body-sm text-body-sm text-text-muted">Điểm trung bình</p>
                      <p className="font-label-md text-label-md text-secondary font-bold">6.8 / 10</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Link
                    to="/login"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                    <span>Làm bài ngay</span>
                  </Link>
                  <button
                    onClick={() => setSelectedScoreExam("Đề Chuyên Lam Sơn: 9.850 lượt, Điểm TB 6.8")}
                    className="px-3 py-2.5 rounded-lg bg-surface-container-low text-text-muted hover:text-text-heading font-label-md text-label-md transition-colors"
                    title="Xem phổ điểm"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">bar_chart</span>
                  </button>
                </div>
              </div>

              {/* Exam Card 3 */}
              <div className="bg-surface-card rounded-2xl p-space-lg flex flex-col justify-between hover:translate-y-[-2px] transition-all shadow-sm border border-border-hairline hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-intellect-indigo-surface text-intellect-indigo font-label-sm text-label-sm font-semibold">
                      Chuẩn Ma Trận 2025
                    </span>
                    <span className="flex items-center gap-1 text-text-muted font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      18.200 lượt thi
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-text-heading line-clamp-2 mb-2 font-bold">
                    Đề phát triển đề minh họa 2025 bám sát cấu trúc mới Bộ GD&ĐT
                  </h3>
                  <p className="font-body-sm text-body-sm text-text-muted mb-4">
                    Bổ sung các dạng trắc nghiệm đúng/sai và trả lời ngắn chuyên đề tiến hóa & sinh thái học.
                  </p>
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-surface-canvas mb-4">
                    <div>
                      <p className="font-body-sm text-body-sm text-text-muted">Thời gian & Số câu</p>
                      <p className="font-label-md text-label-md text-text-heading font-semibold">50 phút • 40 câu</p>
                    </div>
                    <div>
                      <p className="font-body-sm text-body-sm text-text-muted">Điểm trung bình</p>
                      <p className="font-label-md text-label-md text-tertiary font-bold">7.5 / 10</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Link
                    to="/login"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                    <span>Làm bài ngay</span>
                  </Link>
                  <button
                    onClick={() => setSelectedScoreExam("Đề phát triển 2025: 18.200 lượt, Điểm TB 7.5")}
                    className="px-3 py-2.5 rounded-lg bg-surface-container-low text-text-muted hover:text-text-heading font-label-md text-label-md transition-colors"
                    title="Xem phổ điểm"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">bar_chart</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Score dialog notice */}
            {selectedScoreExam && (
              <div className="p-4 rounded-xl bg-brand-emerald-surface border border-emerald-200 text-brand-emerald-dark flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined">analytics</span>
                  <span className="font-medium">Phổ điểm chi tiết: {selectedScoreExam}</span>
                </div>
                <button
                  onClick={() => setSelectedScoreExam(null)}
                  className="text-text-muted hover:text-text-heading text-sm"
                >
                  Đóng
                </button>
              </div>
            )}

            <div className="text-center pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-surface-card text-text-heading font-label-md text-label-md hover:bg-surface-container-low transition-colors shadow-sm border border-border-hairline font-semibold"
              >
                <span>Khám phá toàn bộ 350+ đề thi có lời giải</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 6: HALL OF FAME / STUDENT TESTIMONIALS */}
        <section className="w-full py-16 bg-surface" id="bang-xep-hang">
          <div className="max-w-7xl mx-auto px-margin flex flex-col gap-space-xl">
            <div className="text-center max-w-3xl mx-auto">
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">
                Gương mặt vinh danh
              </span>
              <h2 className="font-headline-lg text-headline-lg text-text-heading mt-1 font-bold">
                Học Sinh 9+ Nói Gì Về BioPrep?
              </h2>
              <p className="font-body-md text-body-md text-text-muted mt-2">
                Kinh nghiệm thực chiến từ các thủ khoa, á khoa khối B00 đỗ Đại học Y Hà Nội, Y Dược TP.HCM.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {/* Testimonial 1 */}
              <div className="bg-surface-card rounded-2xl p-space-lg flex flex-col justify-between border border-border-hairline shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-tertiary">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[18px] text-amber-500"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="font-body-md text-body-md text-text-body italic leading-relaxed">
                    "Trước đây em luôn sợ phần bài tập phả hệ và hoán vị gen vì tính toán quá dài dòng. Từ ngày dùng công cụ mô phỏng tương tác trên BioPrep, em hiểu được bản chất phân ly và rút ngắn thời gian làm đề còn 38 phút."
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-6 mt-4 border-t border-border-hairline">
                  <div className="w-11 h-11 rounded-full bg-brand-emerald-surface text-brand-emerald-dark font-bold flex items-center justify-center">
                    HA
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-text-heading font-bold">Trần Hoàng Anh</p>
                    <p className="font-body-sm text-body-sm text-primary font-semibold">10 Điểm Sinh học • ĐH Y Hà Nội 2024</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-surface-card rounded-2xl p-space-lg flex flex-col justify-between border border-border-hairline shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-tertiary">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[18px] text-amber-500"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="font-body-md text-body-md text-text-body italic leading-relaxed">
                    "Đặc sản của BioPrep là phòng thi bấm giờ mô phỏng y hệt phòng thi thật. Tính năng AI chẩn đoán chỉ đúng lỗ hổng phần Sinh học Tế bào lớp 10 mà em bỏ quên, nhờ vậy em lấy trọn điểm 9.75 đợt vừa rồi!"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-6 mt-4 border-t border-border-hairline">
                  <div className="w-11 h-11 rounded-full bg-accent-amber-surface text-tertiary font-bold flex items-center justify-center">
                    MN
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-text-heading font-bold">Nguyễn Minh Nhật</p>
                    <p className="font-body-sm text-body-sm text-tertiary font-semibold">9.75 Sinh • Thủ khoa khối B Thái Bình</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-surface-card rounded-2xl p-space-lg flex flex-col justify-between border border-border-hairline shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-tertiary">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[18px] text-amber-500"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="font-body-md text-body-md text-text-body italic leading-relaxed">
                    "Bộ Flashcard chu trình sinh địa hóa và sơ đồ tư duy trên BioPrep cứu rỗi trí nhớ của em. Em học Sinh rất nhàn, không cần thức khuya cày cuốc mà vẫn tự tin nắm chắc mức 9+."
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-6 mt-4 border-t border-border-hairline">
                  <div className="w-11 h-11 rounded-full bg-intellect-indigo-surface text-intellect-indigo font-bold flex items-center justify-center">
                    TT
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-text-heading font-bold">Lê Thảo Trang</p>
                    <p className="font-body-sm text-body-sm text-intellect-indigo font-semibold">9.5 Sinh • ĐH Y Dược TP.HCM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: FINAL CALL TO ACTION (LEAD CAPTURE) */}
        <section className="w-full py-16 bg-surface-canvas" id="cong-dong">
          <div className="max-w-7xl mx-auto px-margin">
            <div className="relative overflow-hidden rounded-3xl bg-primary text-on-primary p-8 md:p-14 shadow-xl">
              {/* Background ambient decorative blurs */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-brand-emerald-light/20 blur-3xl pointer-events-none"></div>
              <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-emerald-dark/70 text-brand-emerald-surface font-label-sm text-label-sm border border-brand-emerald-light/30">
                  <span className="material-symbols-outlined text-[16px]">redeem</span>
                  Quà tặng độc quyền kỳ thi 2025
                </span>
                <h2 className="font-display text-display font-bold text-on-primary tracking-tight">
                  Sẵn Sàng Chinh Phục Điểm 9+ Môn Sinh Học?
                </h2>
                <p className="font-body-lg text-body-lg text-primary-fixed-dim/95 leading-relaxed">
                  Để lại thông tin nhận ngay trọn bộ tài liệu: <strong className="text-white">"50 Công thức giải nhanh Di truyền & 10 Đề thi thử có giải chi tiết"</strong> do ban chuyên môn biên soạn.
                </p>

                {/* Quick Lead Form */}
                <form
                  className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto pt-2"
                  onSubmit={handleLeadSubmit}
                >
                  <input
                    value={leadInput}
                    onChange={(e) => setLeadInput(e.target.value)}
                    className="w-full sm:flex-1 px-4 py-3 rounded-lg bg-surface text-text-heading placeholder:text-text-muted text-body-md focus:outline-none focus:ring-2 focus:ring-brand-emerald-light transition-all shadow-inner"
                    placeholder="Nhập Số điện thoại hoặc Email..."
                    required
                    type="text"
                  />
                  <button
                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-amber-500 text-slate-900 font-label-md text-label-md hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shrink-0 font-bold shadow-md hover:scale-[1.02]"
                    type="submit"
                  >
                    <span>Nhận tài liệu ngay</span>
                    <span className="material-symbols-outlined text-[18px]">download</span>
                  </button>
                </form>
                <p className="font-body-sm text-body-sm text-primary-fixed-dim/80">
                  Hoàn toàn miễn phí • Cam kết bảo mật thông tin học sinh 100%
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full bg-surface-container-lowest border-t border-border-hairline">
        <div className="max-w-7xl mx-auto px-margin py-space-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl">
            <div className="lg:col-span-2 space-y-space-md">
              <Link to="/" className="flex items-center gap-2 group select-none">
                <img
                  src="/bioprep-logo.png"
                  alt="BioPrep Logo"
                  className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                />
                <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-text-heading group-hover:text-primary transition-colors">
                  BioPrep
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-brand-emerald-surface text-brand-emerald-dark font-label-sm text-[11px] font-semibold border border-brand-emerald-light/30">
                  Luyện thi THPT 2025
                </span>
              </Link>
              <p className="font-body-md text-body-md text-text-muted leading-relaxed">
                Hệ thống học tập, phân tích phổ điểm và ôn luyện chuyên sâu môn Sinh học bám sát chương trình GDPT mới dành cho học sinh Lớp 10, 11 và 12. Tối ưu phương pháp tư duy bản chất, tự tin bứt phá mục tiêu điểm 9+ kỳ thi Tốt nghiệp THPT & ĐGNL.
              </p>
              <div className="flex flex-wrap gap-space-xs pt-space-xs">
                <span className="px-space-sm py-1 rounded-full bg-brand-emerald-surface text-brand-emerald-dark font-label-sm text-label-sm border border-brand-emerald-light/30 font-semibold">
                  Chuẩn GDPT 2018
                </span>
                <span className="px-space-sm py-1 rounded-full bg-accent-amber-surface text-tertiary font-label-sm text-label-sm border border-tertiary-fixed-dim/40 font-semibold">
                  Cam kết mục tiêu 9+
                </span>
                <span className="px-space-sm py-1 rounded-full bg-intellect-indigo-surface text-intellect-indigo font-label-sm text-label-sm border border-intellect-indigo/20 font-semibold">
                  ĐGNL ĐHQG
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-headline-sm text-headline-sm text-text-heading mb-space-md font-bold">
                Chuyên đề trọng tâm
              </h4>
              <ul className="space-y-space-sm font-body-md text-body-md text-text-muted">
                <li><a className="hover:text-primary transition-colors" href="#chuyen-de">Di truyền phân tử</a></li>
                <li><a className="hover:text-primary transition-colors" href="#chuyen-de">Quy luật di truyền & Biến dị</a></li>
                <li><a className="hover:text-primary transition-colors" href="#chuyen-de">Tiến hóa & Sinh thái học</a></li>
                <li><a className="hover:text-primary transition-colors" href="#chuyen-de">Sinh học tế bào & Vi sinh</a></li>
                <li><a className="hover:text-primary transition-colors" href="#chuyen-de">Sinh lý học Động - Thực vật</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-headline-sm text-headline-sm text-text-heading mb-space-md font-bold">
                Hỗ trợ sĩ tử
              </h4>
              <ul className="space-y-space-sm font-body-md text-body-md text-text-muted">
                <li><a className="hover:text-primary transition-colors" href="#lo-trinh">Lộ trình bứt tốc 90 ngày</a></li>
                <li><a className="hover:text-primary transition-colors" href="#de-thi-tieu-bieu">Đề thi thử THPT các Trường</a></li>
                <li><a className="hover:text-primary transition-colors" href="#cong-dong">Cộng đồng ôn thi Sinh 2K7</a></li>
                <li><a className="hover:text-primary transition-colors" href="#chuyen-de">Hướng dẫn giải & Sơ đồ tư duy</a></li>
                <li><Link className="hover:text-primary transition-colors" to="/login">Hỏi đáp bài tập trực tuyến</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-headline-sm text-headline-sm text-text-heading mb-space-md font-bold">
                Chính sách & Chất lượng
              </h4>
              <ul className="space-y-space-sm font-body-md text-body-md text-text-muted">
                <li><a className="hover:text-primary transition-colors" href="#lo-trinh">Cam kết chuẩn điểm 9+</a></li>
                <li><a className="hover:text-primary transition-colors" href="#lo-trinh">Chính sách bảo mật học tập</a></li>
                <li><a className="hover:text-primary transition-colors" href="#lo-trinh">Điều khoản sử dụng</a></li>
                <li><a className="hover:text-primary transition-colors" href="#lo-trinh">Liên hệ ban cố vấn</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-space-xl pt-space-lg border-t border-border-hairline flex flex-col sm:flex-row items-center justify-between gap-space-md">
            <p className="font-body-sm text-body-sm text-text-caption">
              © 2025 BioPrep - Nền tảng luyện thi Sinh học THPT Quốc gia hàng đầu. All rights reserved.
            </p>
            <div className="flex items-center gap-space-lg text-text-caption font-body-sm text-body-sm">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-brand-emerald-dark">verified</span>
                Chuẩn hóa theo Bộ GD&ĐT
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-tertiary">analytics</span>
                Phân tích năng lực thông minh
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

