import { useState, useEffect } from "react";
import axios from "axios";

const Timer = ({
  value,
  padding = 2,
  duration = 0.9,
  userId,
}: {
  value: number;
  padding: number;
  duration: number;
  userId: string;
}) => {
  const [localUserId, setLocalUserId] = useState<string>(userId); // State to store userId
  const [timeRemaining, setTimeRemaining] = useState<any>(value * 60);
  const [formattedTime, setFormattedTime] = useState<string>("");
  const [running, setRunning] = useState<boolean>(true);
  const [onClick, setOnClick] = useState<boolean>(false);

  useEffect(() => {
    if (onClick) {
      const saveTime = async () => {
        try {
          const response = await axios.post(`/api/v1/timer/save?id=${localUserId}`, {
            timeRemaining: timeRemaining.toString(),
          });
          const data = response.data;
          console.log(data);
        } catch (error) {
          console.error("Error saving timer data:", error);
        }
      };
      saveTime();
    }
  }, [onClick, localUserId, timeRemaining]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev: number) => {
        if (prev <= 0) {
          clearInterval(interval);
          setRunning(false);
          setOnClick(true);
          return 0;
        }
        return prev - 1;
      });
    }, duration * 1000);

    return () => clearInterval(interval);
  }, [duration, running, localUserId]);

  useEffect(() => {
    const hours = String(Math.floor(timeRemaining / 3600)).padStart(padding, "0");
    const minutes = String(Math.floor((timeRemaining % 3600) / 60)).padStart(
      padding,
      "0"
    );
    const seconds = String(timeRemaining % 60).padStart(padding, "0");
    setFormattedTime(`${hours}:${minutes}:${seconds}`);
  }, [timeRemaining, padding]);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        if (localUserId) {
          const response = await axios.post(`/api/v1/timer/get?id=${localUserId}`);
          const savedTime = response.data.data.timeRemaining;
          if (savedTime) {
            setTimeRemaining(savedTime);
          }
        }
      } catch (error) {
        console.error("Error fetching timer data:", error);
      }
    };
    fetchTime();
  }, [localUserId]);

  useEffect(() => {
    if (userId) {
      setLocalUserId(userId);
    }
  }, [userId]);

  const toggleTimer = () => {
    setRunning((prev) => !prev);
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-zinc-800 text-white rounded-2xl shadow-xl mb-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">Timer</h2>
        <p className="text-gray-400 mt-2 text-lg">Track your progress and manage time effectively</p>
      </div>
      <div className="text-center py-8 bg-zinc-900 rounded-lg shadow-md">
        <div className="text-5xl font-mono mb-6 tracking-wider text-white">{formattedTime}</div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={toggleTimer}
            className={`px-5 py-3 rounded-lg font-medium text-white transition-all duration-300 transform ${
              running
                ? "bg-red-600 hover:bg-red-500 hover:scale-105"
                : "bg-green-600 hover:bg-green-500 hover:scale-105"
            }`}
          >
            {running ? "Stop" : "Resume"}
          </button>
          <button
            onClick={() => setOnClick(true)}
            className="px-5 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-all duration-300 transform hover:scale-105"
          >
            Mark Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;
