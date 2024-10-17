"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const hardCodedPassword = process.env.NEXT_PUBLIC_PERSONAL_PASSWORD;

  useEffect(() => {
    setIsLoaded(true);
    const attempts = localStorage.getItem("attempts");
    const timeout = localStorage.getItem("isTimeout");

    // Restore state from localStorage
    if (attempts) {
      setAttempts(parseInt(attempts, 10));
    }
    if (timeout) {
      const remainingTime = parseInt(timeout, 10);
      if (remainingTime > Date.now()) {
        // If the timeout is still active, set isTimeout to true
        const timeLeft = Math.ceil((remainingTime - Date.now()) / 1000);
        setRemainingTime(timeLeft);
        setIsTimeout(true);

        // Reset attempts after the timeout period
        const timeoutDuration = remainingTime - Date.now();
        setTimeout(() => {
          localStorage.removeItem("attempts");
          localStorage.removeItem("isTimeout");
          setAttempts(0);
          setIsTimeout(false);
          setRemainingTime(0); // Reset remaining time
        }, timeoutDuration);
      }
    }
  }, []);

  const [attempts, setAttempts] = useState(0);
  const [isTimeout, setIsTimeout] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const handlePersonalClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault(); // Prevent default link behavior

    // Check if timeout is active
    if (isTimeout) {
      alert(`Too many attempts. Please wait ${remainingTime} seconds before trying again.`);
      return;
    }

    const userInput = prompt('Enter the password to access Personal:');

    // Check if the user clicked Cancel
    if (userInput === null) {
      return; // Exit the function if Cancel is clicked
    }

    if (userInput === hardCodedPassword) {
      window.location.href = "https://personal.amilad.ca"; // Redirect after correct password
    } else {
      const newAttempts = attempts + 1; // Increment the attempt count
      setAttempts(newAttempts);
      localStorage.setItem("attempts", newAttempts.toString()); // Save attempts to localStorage
      alert('Incorrect password. Please try again.');

      // Check if attempts reached 3
      if (newAttempts >= 3) {
        setIsTimeout(true); // Activate timeout
        alert('Too many attempts. Please wait 30 seconds before trying again.');

        // Set timeout in localStorage for 30 seconds
        const timeoutEnd = Date.now() + 30000; // 30 seconds from now
        localStorage.setItem("isTimeout", timeoutEnd.toString());

        // Start countdown for remaining time
        let countdown = 30; // 30 seconds
        setRemainingTime(countdown); // Set initial remaining time
        const interval = setInterval(() => {
          countdown -= 1; // Decrease countdown every second
          setRemainingTime(countdown); // Update state with remaining time

          if (countdown <= 0) {
            clearInterval(interval); // Clear interval when countdown reaches 0
          }
        }, 1000);

        // Set timeout to reset attempts after 30 seconds
        setTimeout(() => {
          localStorage.removeItem("attempts");
          localStorage.removeItem("isTimeout");
          setAttempts(0);
          setIsTimeout(false);
          setRemainingTime(0); // Reset remaining time
          clearInterval(interval); // Clear interval on reset
        }, 30000); // 30 seconds
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-blue-600">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {/* Personal Button */}
        <button
          onClick={handlePersonalClick}
          className={`relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 
            transition-transform duration-700 ${
              isLoaded ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Personal
          </span>
        </button>

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

      {/* Display remaining time if timeout is active */}
      {isTimeout && (
        <div className="fixed bottom-4 left-4 p-4 bg-red-500 text-white rounded">
          Too many attempts. Please wait {remainingTime} seconds before trying again.
        </div>
      )}
    </div>
  );
}
