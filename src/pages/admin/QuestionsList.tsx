import { useState } from "react";

const QuestionsList = () => {
  const [allQuestions, setAllQuestions] = useState([
    {
      id: "gjss",
      question: "What year was the National Orientation Agency established?",
      options: {
        a: "1976",
        b: "1983",
        c: "1992",
        d: "2000",
      },
      correctAnswer: "b",
    },
    {
      id: "djjsks",
      question: "What is the capital of Rivers State?",
      options: {
        a: "Bonny",
        b: "Aba",
        c: "Port Harcourt",
        d: "Omoku",
      },
      correctAnswer: "c",
    },
    {
      id: "sjdds",
      question:
        "Which of the following best describes the relationship between the legislative, executive, and judicial branches of government in a democratic system with checks and balances?",
      options: {
        a: "The legislative branch has absolute power over the other two branches and can override any decision made by them",
        b: "Each branch operates independently with specific powers, and they monitor and limit each other's actions to prevent any single branch from becoming too powerful",
        c: "The executive branch controls both the legislative and judicial branches through direct appointments",
        d: "All three branches share equal power in making, enforcing, and interpreting laws simultaneously",
      },
      correctAnswer: "b",
    },
  ]);
  const [questions, setQuestions] = useState(allQuestions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addQuestionModal, setAddQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    question: "",
    options: { a: "", b: "", c: "", d: "" },
    correctAnswer: "",
  });
  const [dirtyQuestions, setDirtyQuestions] = useState([]);

  const [addQuestionForm, setAddQuestionForm] = useState({
    question: "",
    correctAnswer: "",
    options: [],
  });

  const openEditModal = (question) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      options: { ...question.options },
      correctAnswer: question.correctAnswer,
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (question) => {};

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
    setFormData({
      question: "",
      options: { a: "", b: "", c: "", d: "" },
      correctAnswer: "",
    });
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleEditSave = () => {
    setQuestions(
      questions.map((q) =>
        q.id === editingQuestion.id ? { ...q, ...formData } : q
      )
    );
    closeEditModal();
  };

  const handleDelete = (id) => {
    // if (window.confirm("Are you sure you want to delete this question?")) {
    //   setQuestions(questions.filter((q) => q.id !== id));
    // }
    setDeleteModalOpen(true);
  };

  const openAddQuestionModal = () => {
    setAddQuestionModal(true);
  };

  const closeAddQuestionModal = () => {
    setAddQuestionModal(false);
  };

  const handleAddQuestion = () => {
    openAddQuestionModal();
  };
  const handleSearch = (keyword: string) => {
    setSearchTerm(keyword);
    if (!keyword.trim()) {
      setQuestions(allQuestions);
      return;
    }

    const filtered = allQuestions.filter((question) => {
      const qMatch = question.question
        .toLowerCase()
        .includes(keyword.toLowerCase());
      const oMatch = Object.values(question.options).some((opt) =>
        opt.toLowerCase().includes(keyword.toLowerCase())
      );
      return qMatch || oMatch;
    });
    setQuestions(filtered);
  };

  const handleEdit = (updatedQuestion) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
    setDirtyQuestions((prev) => {
      if (prev.includes(updatedQuestion.id)) {
        return prev; // already marked dirty
      } else {
        return [...prev, updatedQuestion.id]; // add new dirty id
      }
    });
  };

  const handleSaveAll = async () => {
    const updatedItems = questions.filter((q) => dirtyQuestions.includes(q.id));
    await fetch("/api/questions/bulk-update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItems),
    });
    setDirtyQuestions([]);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-900">
      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 justify-end mb-10">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            onClick={handleAddQuestion}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition"
          >
            + Add Question
          </button>
        </div>

        {dirtyQuestions.length > 0 && (
          <button
            onClick={handleSaveAll}
            className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition"
          >
            Save All Changes ({dirtyQuestions.length})
          </button>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-50 text-left text-gray-600 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 w-16">ID</th>
                <th className="px-6 py-4 min-w-[300px]">Question</th>
                <th className="px-6 py-4 min-w-[400px]">Options</th>
                <th className="px-6 py-4 w-24">Correct</th>
                <th className="px-6 py-4 text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, idx) => (
                <tr
                  key={q.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 align-top">
                    <span className="text-gray-500 font-medium text-xs">
                      {idx + 1}
                    </span>
                  </td>

                  {/* Question */}
                  <td className="px-6 py-4 align-top w-[40%]">
                    <p className="font-medium text-gray-800 leading-relaxed">
                      {q.question}
                    </p>
                  </td>

                  {/* Options - Improved Design */}
                  <td className="px-6 py-4 align-top">
                    <div className="space-y-2">
                      {Object.entries(q.options).map(([key, value]) => (
                        <div
                          key={key}
                          className={`flex items-start gap-2 p-2.5 rounded-lg border transition ${
                            q.correctAnswer === key
                              ? "bg-green-50 border-green-300 ring-1 ring-green-200"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <span className="font-bold text-xs text-gray-600 mt-0.5 flex-shrink-0">
                            {key.toUpperCase()}.
                          </span>
                          <span className="text-gray-700 text-xs leading-relaxed break-words">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Correct Answer */}
                  <td className="px-6 py-4 align-top">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                      {q.correctAnswer.toUpperCase()}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right align-top flex space-x-3">
                    <button
                      onClick={() => openEditModal(q)}
                      className="text-blue-600 hover:text-blue-700 hover:underline  font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="text-red-600 hover:text-red-700 hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Question
              </h2>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-6">
              {/* Question Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Question
                </label>
                <textarea
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="Enter your question..."
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Options
                </label>
                <div className="space-y-3">
                  {Object.entries(formData.options).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-700 font-bold rounded-lg">
                        {key.toUpperCase()}
                      </span>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            options: {
                              ...formData.options,
                              [key]: e.target.value,
                            },
                          })
                        }
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Option ${key.toUpperCase()}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Correct Answer */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Correct Answer
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {Object.keys(formData.options).map((key) => (
                    <button
                      key={key}
                      onClick={() =>
                        setFormData({ ...formData, correctAnswer: key })
                      }
                      className={`py-3 rounded-xl font-bold text-sm transition ${
                        formData.correctAnswer === key
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {key.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl border-t border-gray-200">
              <button
                onClick={closeEditModal}
                className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-semibold text-gray-900">
                Delete Question
              </h2>
              <button
                onClick={closeDeleteModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 text-center">
              <p>Do you really want to delete this question?</p>
            </div>
            <div className="flex justify-center items-center gap-5 my-5">
              <button className="rounded-lg bg-red-600 w-[10rem] cursor-pointer hover:bg-red-500 transition duration-300 py-3 text-white">
                Yes
              </button>
              <button className="rounded-lg bg-slate-600 cursor-pointer  hover:bg-slate-500 transition duration-300 w-[10rem] py-3 text-white">
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {addQuestionModal && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}~
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-semibold text-gray-900">
                Add a Question
              </h2>
              <button
                onClick={closeAddQuestionModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex justify-center items-center gap-5 my-5">
              <p>Modal to add questions</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsList;
