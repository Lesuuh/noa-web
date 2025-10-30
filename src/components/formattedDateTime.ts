export const formatAttemptTime = (started_at: string) => {
  const date = new Date(started_at);

  // Weekday, e.g., "Wed"
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });

  // Day with suffix
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  // Month, e.g., "Oct"
  const month = date.toLocaleDateString("en-US", { month: "short" });

  // Time, e.g., "02:35 PM"
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    dateLabel: `${weekday} ${day}${suffix} ${month}`, // "Wed 29th Oct"
    fullDate: date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }), // "Wed, Oct 29, 2025"
    time, // "02:35 PM"
  };
};
