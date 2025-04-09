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
  const questionNumbers = [];
  for (let i = 0; i < totalQuestions; i++) {
    questionNumbers.push(i);
  }

  return (
    <div className="flex flex-wrap max-w-[1400px] mx-auto w-full gap-2 p-4 bg-white rounded-lg shadow-sm">
      {questionNumbers.map((questionNumber) => {
        // Determine the button style based on its state
        let buttonStyle = "bg-gray-100 text-gray-600 hover:bg-gray-200"; // Default style

        if (questionNumber === currentQuestion) {
          buttonStyle = "bg-blue-600 text-white"; // Current question style
        } else if (answers[questionNumber] !== undefined) {
          buttonStyle = "bg-green-100 text-green-800 border-2 border-green-500"; // Answered question style
        }

        return (
          <button
            key={questionNumber}
            onClick={() => onQuestionSelect(questionNumber)}
            className={`w-8 h-8 rounded-lg font-medium transition-colors ${buttonStyle}`}
          >
            {questionNumber + 1}
          </button>
        );
      })}
    </div>
  );
};
