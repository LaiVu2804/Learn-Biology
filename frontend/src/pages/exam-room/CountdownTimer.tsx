import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
  initialSeconds?: number;
  totalQuestions?: number;
  answeredCount?: number;
  onTimeUp?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds = 50 * 60, // 50 mins default
  totalQuestions = 40,
  answeredCount = 26,
  onTimeUp,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const percentLeft = Math.round((secondsLeft / initialSeconds) * 100);
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="bg-surface-card rounded-xl p-5 relative overflow-hidden shadow-sm border border-border-hairline">
      <div className="flex items-center justify-between pb-3">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-text-muted font-bold flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-[18px]">timer</span>
          Thời gian còn lại
        </span>
        <span className="px-2 py-0.5 rounded text-[11px] font-label-sm font-semibold bg-accent-amber-surface text-tertiary border border-tertiary-fixed-dim/30">
          Tổng 50 phút
        </span>
      </div>

      {/* Digital Clock Display with Circular Progress SVG */}
      <div className="flex items-center justify-between py-2">
        <div className="flex flex-col">
          <span className="font-display text-3xl sm:text-4xl text-text-heading font-mono font-bold tracking-tight">
            {formattedTime}
          </span>
          <span className="text-xs text-text-muted mt-0.5">
            Thời gian bắt đầu: 14:00 • Kết thúc: 14:50
          </span>
        </div>

        {/* Lightweight Inline SVG Gauge Meter */}
        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-surface-canvas"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="3.5"
            />
            <path
              className="text-primary transition-all duration-1000 ease-linear"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#006948"
              strokeDasharray="100, 100"
              strokeDashoffset={100 - percentLeft}
              strokeLinecap="round"
              strokeWidth="3.5"
            />
          </svg>
          <span className="absolute text-xs font-mono font-bold text-text-heading">
            {percentLeft}%
          </span>
        </div>
      </div>

      {/* Progress summary bar */}
      <div className="mt-4 pt-4 border-t border-border-subtle">
        <div className="flex items-center justify-between text-xs font-label-sm font-semibold text-text-heading mb-1.5">
          <span>Tiến độ hoàn thành: {answeredCount}/{totalQuestions} câu</span>
          <span className="text-primary font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-surface-canvas overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;

