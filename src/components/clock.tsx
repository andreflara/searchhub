import React, { useState, useEffect } from "react";

const Card = () => {
  const [time, setTime] = useState<Date | null>(null); // Initialize with null

  useEffect(() => {
    // Set the time to the current date once the component is mounted on the client
    setTime(new Date());

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) return null; // Don't render until time is available

  const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="flex items-center justify-between bg-black text-[#9aa2ad] border border-gray-800 shadow-lg shadow-black/70 rounded-lg px-4 py-2 w-[145px]">
      <p className="text-lg font-semibold flex items-baseline">
        <span>{formattedTime}</span>
      </p>
    </div>
  );
};

export default Card;
