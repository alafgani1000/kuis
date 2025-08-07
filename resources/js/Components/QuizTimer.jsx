import React, { useState, useEffect } from "react";

const QuizTimer = ({ durationInSeconds }) => {
    const [timeLeft, setTimeLeft] = useState(durationInSeconds);

    useEffect(() => {
        const startTime = localStorage.getItem("quizStartTime") || Date.now();
        localStorage.setItem("quizStartTime", startTime);

        const updateTime = () => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            const remainingTime = Math.max(durationInSeconds - elapsedTime, 0);
            setTimeLeft(remainingTime);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, [durationInSeconds]);

    return (
        <div className="text-center text-sm sm:text-start font-semibold">
            <h2>Waktu tersisa: {timeLeft} detik</h2>
        </div>
    );
};

export default QuizTimer;
