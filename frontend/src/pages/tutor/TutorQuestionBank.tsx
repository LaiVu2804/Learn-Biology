import React, { useState, useMemo } from "react";
import QuestionModal from "./QuestionModal";
import { notification } from "antd";

export const TutorQuestionBank: React.FC = () => {
  const [questions, setQuestions] = useState<ITutorQuestion[]>([
    {
      id: "BIO-Q-0182",
      topic: "Di truyền phân tử",
      subTopic: "Đột biến điểm",
      level: "Vận dụng cao",
      content:
        "Một gen ở sinh vật nhân sơ có chiều dài 4080 Å, số nuclêôtit loại A chiếm 20%. Gen bị đột biến điểm làm giảm 2 liên kết hiđrô so với gen ban đầu. Biết đột biến không làm thay đổi chiều dài của gen. Số nuclêôtit từng loại của gen đột biến là bao nhiêu?",
      status: "Đã duyệt",
      author: "ThS. Nguyễn Mai Linh",
      usedInExams: 6,
      correctRate: "38.5%",
    },
    {
      id: "BIO-Q-0183",
      topic: "Quy luật Men-đen",
      subTopic: "Phép lai 2 cặp tính trạng",
      level: "Thông hiểu",
      content:
        "Ở đậu Hà Lan, gen A quy định hạt vàng trội hoàn toàn so với gen a quy định hạt xanh; gen B quy định hạt trơn trội hoàn toàn so với gen b quy định hạt nhăn. Cho cây dị hợp 2 cặp gen tự thụ phấn thu được F1. Tỉ lệ kiểu hình hạt vàng, trơn thuần chủng ở F1 là bao nhiêu?",
      status: "Đã duyệt",
      author: "ThS. Nguyễn Mai Linh",
      usedInExams: 12,
      correctRate: "82.4%",
    },
    {
      id: "BIO-Q-0184",
      topic: "Di truyền học người",
      subTopic: "Phân tích phả hệ bệnh mù màu",
      level: "Vận dụng cao",
      content:
        "Sơ đồ phả hệ dưới đây mô tả sự di truyền của hai bệnh P và Q ở người, mỗi bệnh do một trong hai alen của một gen quy định. Alen gây bệnh P nằm trên NST thường, alen gây bệnh Q nằm trên vùng không tương đồng của NST X. Xác suất sinh con đầu lòng không mắc bệnh của cặp vợ chồng III-2 và III-3 là:",
      status: "Chờ thẩm định",
      author: "ThS. Nguyễn Mai Linh",
      usedInExams: 1,
      correctRate: "24.1%",
    },
    {
      id: "BIO-Q-0185",
      topic: "Sinh thái học",
      subTopic: "Diễn thế sinh thái",
      level: "Nhận biết",
      content:
        "Trong một chuỗi thức ăn mở đầu bằng sinh vật sản xuất trong hệ sinh thái đồng cỏ, sinh vật tiêu thụ bậc 1 luôn thuộc nhóm sinh vật nào sau đây?",
      status: "Đã duyệt",
      author: "ThS. Nguyễn Mai Linh",
      usedInExams: 18,
      correctRate: "91.0%",
    },
    {
      id: "BIO-Q-0186",
      topic: "Di truyền phân tử",
      subTopic: "Cơ chế điều hòa Operon Lac",
      level: "Vận dụng",
      content:
        "Khi nói về điều hòa hoạt động của operon Lac ở vi khuẩn E. coli, điều nào sau đây là KHÔNG đúng khi môi trường có lactôzơ?",
      status: "Đã duyệt",
      author: "ThS. Nguyễn Mai Linh",
      usedInExams: 9,
      correctRate: "65.2%",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (selectedTopic !== "all" && !q.topic.includes(selectedTopic)) return false;
      if (selectedLevel !== "all" && q.level !== selectedLevel) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchContent = q.content.toLowerCase().includes(term);
        const matchId = q.id.toLowerCase().includes(term);
        const matchSub = q.subTopic?.toLowerCase().includes(term);
        if (!matchContent && !matchId && !matchSub) return false;
      }
      return true;
    });
  }, [questions, selectedTopic, selectedLevel, searchTerm]);

  const handleSaveQuestion = (newQ: ITutorQuestion) => {
    setQuestions([newQ, ...questions]);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-hairline">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
            <span className="font-label-sm text-xs text-brand-emerald-dark font-bold uppercase tracking-wider">
              Khảo Thí & Biên Soạn Chuyên Sâu
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-text-heading tracking-tight">
            Ngân Hàng Câu Hỏi Sinh Học
          </h1>
          <p className="font-body-sm text-xs sm:text-sm text-text-muted">
            Kho {questions.length} câu hỏi trắc nghiệm chuẩn hóa 4 mức độ tư duy bám sát đề thi THPT & ĐHQG
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-brand-emerald-dark text-on-primary rounded-lg font-label-md text-xs font-semibold shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Soạn câu hỏi mới</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-surface-card p-4 rounded-xl border border-border-hairline flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-caption text-[18px]">
            search
          </span>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo nội dung, mã câu hỏi (BIO-Q-...) hoặc tiểu mục..."
            className="w-full bg-surface-canvas border border-border-hairline rounded-lg pl-9 pr-3 py-2 text-xs text-text-heading placeholder-text-caption focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="bg-surface-canvas border border-border-hairline rounded-lg px-3 py-2 text-xs text-text-heading focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">Tất cả Chuyên đề</option>
            <option value="Di truyền phân tử">Di truyền phân tử & Tế bào</option>
            <option value="Men-đen">Quy luật Men-đen & Tương tác gen</option>
            <option value="Di truyền học người">Di truyền người & Phả hệ</option>
            <option value="Sinh thái">Sinh thái học & Quần thể</option>
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-surface-canvas border border-border-hairline rounded-lg px-3 py-2 text-xs text-text-heading focus:outline-none focus:border-primary cursor-pointer font-semibold"
          >
            <option value="all">Tất cả Mức độ</option>
            <option value="Nhận biết">Nhận biết</option>
            <option value="Thông hiểu">Thông hiểu</option>
            <option value="Vận dụng">Vận dụng</option>
            <option value="Vận dụng cao">Vận dụng cao (9+)</option>
          </select>
        </div>
      </div>

      {/* Question Cards List */}
      <div className="flex flex-col gap-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-surface-card p-12 rounded-xl border border-border-hairline text-center text-text-muted">
            Không tìm thấy câu hỏi phù hợp.
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isVDC = q.level === "Vận dụng cao";
            const isVD = q.level === "Vận dụng";
            const isTH = q.level === "Thông hiểu";
            const isApproved = q.status === "Đã duyệt";

            return (
              <div
                key={q.id}
                className="bg-surface-card rounded-xl p-5 border border-border-hairline shadow-sm hover:border-brand-emerald-light/60 transition-all flex flex-col gap-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-brand-emerald-surface">
                      {q.id}
                    </span>
                    <span className="font-label-md text-xs font-semibold text-text-heading">
                      {q.topic} • <span className="text-text-muted font-normal">{q.subTopic}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isVDC
                          ? "bg-rose-50 text-rose-600 border-rose-200"
                          : isVD
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : isTH
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {q.level}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        isApproved
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isApproved ? "bg-emerald-600" : "bg-amber-500"
                        }`}
                      ></span>
                      {q.status}
                    </span>
                  </div>
                </div>

                <p className="font-body-md text-sm text-text-heading leading-relaxed">
                  {q.content}
                </p>

                <div className="pt-2 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs text-text-muted">
                  <div className="flex items-center gap-4">
                    <span>
                      Tác giả: <strong className="text-text-heading">{q.author}</strong>
                    </span>
                    <span>
                      Xuất hiện trong: <strong className="text-text-heading">{q.usedInExams} đề thi</strong>
                    </span>
                    <span>
                      Tỉ lệ đúng: <strong className="text-primary">{q.correctRate}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        notification.success({
                          message: "Đã copy câu hỏi",
                          description: `Mã ${q.id} đã được sao chép vào bộ nhớ đệm.`,
                        });
                      }}
                      className="px-2.5 py-1 rounded bg-surface-canvas hover:bg-surface-container-low text-text-body font-label-md text-xs border border-border-hairline transition-colors cursor-pointer"
                      type="button"
                    >
                      Sao chép đề
                    </button>
                    <button
                      onClick={() => {
                        notification.info({
                          message: "Chỉnh sửa câu hỏi",
                          description: `Mở trình soạn thảo chuyên sâu cho câu hỏi ${q.id}.`,
                        });
                      }}
                      className="px-2.5 py-1 rounded bg-primary/10 hover:bg-primary/20 text-primary font-label-md text-xs font-semibold transition-colors cursor-pointer"
                      type="button"
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Creation Modal */}
      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuestion}
      />
    </div>
  );
};

export default TutorQuestionBank;

