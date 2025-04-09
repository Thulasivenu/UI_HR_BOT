import React, { useState, useEffect } from "react";
 
const DateTimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState("");
  const isDark = localStorage.getItem("theme") === "dark";

 
  useEffect(() => {
    const formatDateTime = () => {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      const now = new Date();
 
      const day = String(now.getDate()).padStart(2, "0");
      const month = months[now.getMonth()];
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
 
      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };
 
    // Update time only once when the component mounts
    setCurrentTime(formatDateTime());
  }, []); // Empty dependency array ensures it runs only once
 
  // return <p className={`querySet  text-[gray] text-[0.65em]  p-1.5  rounded-[25px] break-words`}>{currentTime}</p>;
  return <p className={`text-[gray] text-[0.65em]  p-1.5  rounded-[25px] break-words`}>{currentTime}</p>;
};
 
export default DateTimeDisplay;