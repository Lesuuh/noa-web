export interface ExamState {
  currentQuestion: number;
  answers: Record<number, number>;
  timeRemaining: number;
  isSubmitted: boolean;
}


export interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
  }
  