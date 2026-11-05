import React, { useState } from "react";
import { notification } from "antd";

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: any) => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [topic, setTopic] = useState("Cơ chế di truyền & Biến dị");
  const [subTopic, setSubTopic] = useState("Đột biến gen & Phiên mã");
  const [level, setLevel] = useState("Vận dụng cao");
  const [content, setContent] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctOption, setCorrectOption] = useState("A");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      notification.warning({ message: "Vui lòng nhập nội dung câu hỏi" });
      return;
    }

    const newQ = {
      id: `BIO-Q-${Math.floor(1000 + Math.random() * 9000)}`,
      topic,
      subTopic,
      level,
      content,
      status: "Chờ thẩm định",
      author: "ThS. Nguyễn Mai Linh",
      usedInExams: 0,
      correctRate: "Chưa thi",
    };

    onSave(newQ);
    notification.success({
      message: "Biên soạn thành công",
      description: `Câu hỏi ${newQ.id} đã được đưa vào Ngân hàng câu hỏi Sinh học.`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-card border border-border-hairline rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border-hairline flex items-center justify-between bg-surface-canvas/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">post_add</span>
            <h3 className="font-headline-sm text-base sm:text-lg font-bold text-text-heading">
              Biên Soạn Câu Hỏi Sinh Học Mới
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-heading p-1 rounded-md transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 flex flex-col gap-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-text-heading">Chuyên đề Sinh học:</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-surface-canvas border border-border-hairline rounded-lg px-2.5 py-2 text-text-heading focus:outline-none focus:border-primary cursor-pointer"
              >
                <option>Cơ chế di truyền & Biến dị</option>
                <option>Quy luật di truyền Men-đen</option>
                <option>Di truyền học người & Phả hệ</option>
                <option>Sinh thái học & Môi trường</option>
                <option>Tiến hóa & Đa dạng sinh học</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-text-heading">Dạng bài / Tiểu mục:</label>
              <input
                value={subTopic}
                onChange={(e) => setSubTopic(e.target.value)}
                placeholder="Ví dụ: Đột biến gen, Operon Lac..."
                className="bg-surface-canvas border border-border-hairline rounded-lg px-2.5 py-2 text-text-heading focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-text-heading">Mức độ nhận thức:</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="bg-surface-canvas border border-border-hairline rounded-lg px-2.5 py-2 text-text-heading focus:outline-none focus:border-primary cursor-pointer font-semibold"
              >
                <option>Nhận biết</option>
                <option>Thông hiểu</option>
                <option>Vận dụng</option>
                <option>Vận dụng cao</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-text-heading">Nội dung câu hỏi:</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập đề bài sinh học, giả thiết, số liệu chuỗi ADN, đột biến..."
              className="bg-surface-canvas border border-border-hairline rounded-lg p-3 text-text-heading focus:outline-none focus:border-primary font-body-sm leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-text-heading">Phương án A:</label>
              <input
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                placeholder="Nội dung phương án A"
                className="bg-surface-canvas border border-border-hairline rounded-lg px-3 py-2 text-text-heading focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-text-heading">Phương án B:</label>
              <input
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                placeholder="Nội dung phương án B"
                className="bg-surface-canvas border border-border-hairline rounded-lg px-3 py-2 text-text-heading focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-text-heading">Phương án C:</label>
              <input
                value={optionC}
                onChange={(e) => setOptionC(e.target.value)}
                placeholder="Nội dung phương án C"
                className="bg-surface-canvas border border-border-hairline rounded-lg px-3 py-2 text-text-heading focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-text-heading">Phương án D:</label>
              <input
                value={optionD}
                onChange={(e) => setOptionD(e.target.value)}
                placeholder="Nội dung phương án D"
                className="bg-surface-canvas border border-border-hairline rounded-lg px-3 py-2 text-text-heading focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-brand-emerald-surface rounded-lg border border-outline-variant/30">
            <span className="font-semibold text-brand-emerald-dark">Đáp án đúng:</span>
            {(["A", "B", "C", "D"] as const).map((opt) => (
              <label key={opt} className="inline-flex items-center gap-1.5 cursor-pointer font-bold">
                <input
                  type="radio"
                  name="correct_option"
                  checked={correctOption === opt}
                  onChange={() => setCorrectOption(opt)}
                  className="text-primary focus:ring-primary w-4 h-4"
                />
                <span className="text-brand-emerald-dark">Phương án {opt}</span>
              </label>
            ))}
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-border-hairline flex items-center justify-end gap-2.5">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 border border-border-hairline rounded-lg font-label-md text-xs text-text-body hover:bg-surface-card transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary hover:bg-brand-emerald-dark text-on-primary font-label-md text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Lưu vào Ngân hàng câu hỏi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;

