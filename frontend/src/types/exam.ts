export type GradeType = "12" | "11" | "10";

export type ExamFormatType = "quiz-15m" | "midterm-45m" | "mock-50m" | "deep-practice";

export type CognitionLevelType = "level-1" | "level-2" | "level-3" | "level-4";

export interface IExamConfig {
  grade: GradeType;
  format: ExamFormatType;
  levels: CognitionLevelType[];
  targetMajor: string;
}

export interface IOption {
  id: "A" | "B" | "C" | "D";
  text: string;
}

export interface IExamQuestion {
  id: string;
  number: number;
  total: number;
  levelText: string;
  topic: string;
  stem: string[];
  tableData?: {
    title: string;
    note: string;
    headers: string[];
    rows: { col1: string; col2: string; col3: string; col4: string; col5: string; highlight?: boolean }[];
  };
  prompt: string;
  options: IOption[];
  correctOption: "A" | "B" | "C" | "D";
  explanation?: string;
}

