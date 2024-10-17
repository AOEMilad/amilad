"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [timeout, setTimeoutState] = useState<number>(0);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);
  const password = process.env.NEXT_PUBLIC_PERSONAL_PASSWORD;

  useEffect(() => {
    setIsLoaded(true);
    const savedAttempts = localStorage.getItem("attempts");
    const savedTimeout = localStorage.getItem("timeout");

    if (savedAttempts) {
      setAttempts(Number(savedAttempts));
    }

    if (savedTimeout) {
      const currentTime = Date.now();
      if (currentTime < Number(savedTimeout)) {
        setIsTimedOut(true);
        setTimeoutState((Number(savedTimeout) - currentTime) / 1000); // in seconds
      }
    }
  }, []);

  const handlePersonalClick = () => {
    if (isTimedOut) {
      alert(`You are temporarily locked out. Please wait ${Math.ceil(timeout)} seconds.`);
      return;
    }

    const inputPassword = prompt("Enter password:");

    if (inputPassword === null) {
      return; // User clicked cancel
    }

    if (inputPassword === password) {
      alert("Access granted!");
      // Redirect to the personal link or perform your action here
      window.location.href = "https://personal.amilad.ca";
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem("attempts", newAttempts.toString()); // Save attempts to localStorage

      if (newAttempts >= 3) {
        const lockoutTime = 30; // seconds
        setIsTimedOut(true);
        const unlockTime = Date.now() + lockoutTime * 1000;
        localStorage.setItem("timeout", unlockTime.toString()); // Save timeout to localStorage

        let countdown = lockoutTime;
        setTimeout(() => {
          setIsTimedOut(false);
          setAttempts(0);
          localStorage.setItem("attempts", "0"); // Reset attempts
          localStorage.removeItem("timeout"); // Remove timeout
        }, lockoutTime * 1000);

        const interval = setInterval(() => {
          countdown--;
          setTimeoutState(countdown);
          if (countdown <= 0) {
            clearInterval(interval);
          }
        }, 1000);
      } else {
        alert(`Incorrect password. You have ${3 - newAttempts} attempts left.`);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-blue-600">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {/* Personal Button */}
        <Link
          href="#"
          onClick={handlePersonalClick}
          className={`relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 
            transition-transform duration-700 ${
              isLoaded ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Personal
          </span>
        </Link>

        {/* Portfolio Button */}
        <Link
          href="https://portfolio.amilad.ca"
          className={`relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800 
            transition-transform duration-700 ${
              isLoaded ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Portfolio
          </span>
        </Link>
      </div>
    </div>
  );
}
