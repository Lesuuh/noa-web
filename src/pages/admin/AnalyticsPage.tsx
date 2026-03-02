import React from "react";

const AnalyticsPage = () => {
  const stats = [
    { title: "Total Questions", value: "452", color: "bg-blue-500" },
    { title: "Edited This Week", value: "34", color: "bg-yellow-500" },
    { title: "Deleted Questions", value: "8", color: "bg-red-500" },
    { title: "Newly Added", value: "56", color: "bg-green-500" },
  ];

  const activity = [
    {
      id: 1,
      action: "Edited question on current affairs",
      time: "2 hours ago",
      user: "Admin",
    },
    {
      id: 2,
      action: "Deleted outdated economics question",
      time: "Yesterday",
      user: "Admin",
    },
    {
      id: 3,
      action: "Added 10 new questions to general knowledge",
      time: "2 days ago",
      user: "Admin",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Analytics & Reports</h1>
        <button className="px-5 py-2 bg-black text-white rounded-xl hover:opacity-80 transition">
          Export Report
        </button>
      </header>

      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center"
          >
            <div
              className={`${item.color} w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-lg mb-3`}
            >
              {item.value[0]}
            </div>
            <h3 className="text-2xl font-semibold">{item.value}</h3>
            <p className="text-sm text-gray-500">{item.title}</p>
          </div>
        ))}
      </section>

      {/* Recent Activity */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <ul className="divide-y divide-gray-100">
          {activity.map((log) => (
            <li
              key={log.id}
              className="py-4 flex justify-between items-center hover:bg-gray-50 px-2 rounded-xl transition"
            >
              <div>
                <p className="text-sm font-medium">{log.action}</p>
                <p className="text-xs text-gray-500">
                  {log.user} • {log.time}
                </p>
              </div>
              <button className="text-blue-600 text-sm hover:underline">
                View Details
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <footer className="mt-10 flex justify-center text-sm text-gray-500">
        Updated just now • NOA Admin Dashboard
      </footer>
    </div>
  );
};

export default AnalyticsPage;
