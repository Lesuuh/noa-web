import React from "react";

export const TimerDisplay = React.memo(({ time }: { time: number }) => {
  console.log("timer");
  const hours = String(Math.floor(time / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");

  return (
    <span className="font-mono">
      {hours}:{minutes}:{seconds}
    </span>
  );
});
