import React, { useState, useEffect } from "react";

const QuizTimer = ({ durationInMinutes, onTimeUpdate, quizId }) => {
    const [timeLeft, setTimeLeft] = useState(durationInMinutes);

    useEffect(() => {
        axios.get("/quiz/" + quizId + "/sync-time-taken", {}).then((res) => {
            const { data } = res;
            console.log(data.time_taken);
            if (data.time_taken == null) {
                // create new time taken if not exist
                const startTime = Date.now();
                localStorage.setItem("quizStartTime" + quizId, startTime);

                axios.post("/quiz/sync-time-taken", {
                    quiz_id: quizId,
                    time_taken: startTime,
                    time: (durationInMinutes * 60) + (30 * 60)
                });
            } else {
                const startTime = data.time_taken;
                localStorage.setItem("quizStartTime" + quizId, startTime);
            }
        });


    }, []);

    useEffect(() => {
        let startTime = localStorage.getItem("quizStartTime" + quizId);
        if (startTime == null) {
            axios.get("/quiz/" + quizId + "/sync-time-taken", {}).then((res) => {
                const { data } = res;
                if (data.time_taken == null) {
                    localStorage.setItem("quizStartTime" + quizId, Date.now());
                } else {
                    localStorage.setItem("quizStartTime" + quizId, data.time_taken);
                }
            });

        }
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
