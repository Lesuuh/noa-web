const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-900">
      {/* Page Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Overview
          </h2>
          <p className="text-gray-500 text-sm">
            Quick summary of question stats and recent admin activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { title: "Total Questions", value: "1,248" },
            { title: "Edited This Week", value: "12" },
            { title: "Deleted Questions", value: "4" },
            { title: "Active Admins", value: "2" },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-sm text-gray-500">{card.title}</h3>
              <p className="text-3xl font-semibold mt-2">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Activity Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <button className="text-sm text-blue-600 hover:underline">
              View All
            </button>
          </div>

          <ul className="divide-y divide-gray-100">
            {[
              {
                action: "Question #245 updated",
                time: "2 hours ago",
              },
              {
                action:
                  "Added new question: ‘What is the capital of Lagos State?’",
                time: "Yesterday",
              },
              {
                action: "Deleted outdated current affairs question",
                time: "2 days ago",
              },
              {
                action: "Edited answer for question #132",
                time: "3 days ago",
              },
            ].map((item, i) => (
              <li key={i} className="py-3 flex justify-between items-center">
                <span className="text-gray-700 text-sm">{item.action}</span>
                <span className="text-gray-400 text-xs">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
