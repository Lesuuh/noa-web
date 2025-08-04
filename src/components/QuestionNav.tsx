import React from "react";

interface QuestionNavProps {
  totalQuestions: number;
  currentQuestion: number;
  answers: Record<number, number>;
  onQuestionSelect: (index: number) => void;
}

export const QuestionNav: React.FC<QuestionNavProps> = ({
  totalQuestions,
  currentQuestion,
  answers,
  onQuestionSelect,
}) => {
  // Create an array of question numbers (1 to totalQuestions)
  const questionNumbers = Array.from({ length: totalQuestions }, (_, i) => i);

  return (
    <div className="flex flex-wrap max-w-[1400px] mx-auto w-full gap-2 p-4 bg-gray-800 rounded-xl shadow-md">
      {questionNumbers.map((questionNumber) => {
        // Determine the button style based on its state
        let buttonStyle = "bg-gray-700 text-gray-300 hover:bg-gray-600"; // Default style

        if (questionNumber === currentQuestion) {
          buttonStyle = "bg-blue-600 text-white hover:bg-blue-500"; // Current question style
        } else if (answers[questionNumber] !== undefined) {
          buttonStyle =
            "bg-green-900 text-green-300 border-2 border-green-500 hover:bg-green-800"; // Answered question style
        }

        return (
          <button
            key={questionNumber}
            onClick={() => onQuestionSelect(questionNumber)}
            className={`w-10 h-10 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm ${buttonStyle}`}
          >
            {questionNumber + 1}
          </button>
        );
      })}
    </div>
  );
};
