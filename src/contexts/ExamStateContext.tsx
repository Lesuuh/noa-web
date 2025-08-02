import React, { createContext, useState, ReactNode, useContext } from "react";

type ExamStateProps = {
  currentQuestion: number;
  answers: Record<number, number>;
  timeRemaining: number;
  isSubmitted: boolean;
  score: number;
};

type ExamContextType = {
  examState: ExamStateProps;
  setExamState: React.Dispatch<React.SetStateAction<ExamStateProps>>;
};

const ExamContext = createContext<ExamContextType | undefined>(undefined);

type ExamProviderProps = {
  children: ReactNode;
};

const initialState: ExamStateProps = {
  currentQuestion: 0,
  answers: {},
  timeRemaining: 60 * 60,
  isSubmitted: false,
  score: 0,
};

export const ExamContextProvider = ({ children }: ExamProviderProps) => {
  const [examState, setExamState] = useState<ExamStateProps>(initialState);

  return (
    <ExamContext.Provider value={{ examState, setExamState }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExamState = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error("useExamState must be used within an ExamContextProvider");
  }
  return context;
};
