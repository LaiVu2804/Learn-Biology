import React from "react";

export const AppFooter: React.FC = () => {
  return (
    <footer className="w-full bg-surface-card border-t border-border-hairline mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-text-muted font-body-sm text-body-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-emerald-surface text-brand-emerald-dark font-label-sm text-label-sm font-semibold border border-brand-emerald-light/30">
            <span className="w-2 h-2 rounded-full bg-brand-emerald-dark animate-pulse"></span>
            Kết nối trực tuyến máy chủ thi: Ổn định
          </span>
          <span className="text-border-hairline hidden sm:inline">|</span>
          <span className="text-text-caption hidden sm:inline">Hệ thống BioPrep v2.4 Academic 2025</span>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center text-xs text-text-muted">
          <span className="inline-flex items-center gap-1 text-text-caption">
            <kbd className="px-1.5 py-0.5 rounded bg-surface-canvas border border-border-hairline text-[11px] font-mono text-text-body font-medium">
              Ctrl + K
            </kbd>{" "}
            Tìm nhanh
          </span>
          <span className="inline-flex items-center gap-1 text-text-caption">
            <kbd className="px-1.5 py-0.5 rounded bg-surface-canvas border border-border-hairline text-[11px] font-mono text-text-body font-medium">
              Space
            </kbd>{" "}
            Chọn đáp án
          </span>
          <span className="inline-flex items-center gap-1 text-text-caption">
            <kbd className="px-1.5 py-0.5 rounded bg-surface-canvas border border-border-hairline text-[11px] font-mono text-text-body font-medium">
              F
            </kbd>{" "}
            Đánh dấu cờ
          </span>
          <a href="#help" className="hover:text-primary transition-colors underline decoration-border-hairline">
            Hỗ trợ trợ giảng 24/7
          </a>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;

