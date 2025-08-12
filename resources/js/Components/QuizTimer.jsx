import React, { useState, useEffect } from "react";

const QuizTimer = ({ durationInMinutes, onTimeUpdate }) => {
    const [timeLeft, setTimeLeft] = useState(durationInMinutes);

    useEffect(() => {
        const startTime = localStorage.getItem("quizStartTime") || Date.now();
        localStorage.setItem("quizStartTime", startTime);

        const updateTime = () => {
            const elapsedTime = Math.floor(
                (Date.now() - startTime) / (1000 * 60)
            );
            const remainingTime = Math.max(durationInMinutes - elapsedTime, 0);
            setTimeLeft(remainingTime);
            if (onTimeUpdate) {
                onTimeUpdate(remainingTime); // 🔔 Notify parent
            }
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, [durationInMinutes, onTimeUpdate]);

    return (
        <div className="text-center text-sm sm:text-start font-semibold">
            <h2>Waktu tersisa: {timeLeft} Menit</h2>
        </div>
    );
};

export default QuizTimer;
