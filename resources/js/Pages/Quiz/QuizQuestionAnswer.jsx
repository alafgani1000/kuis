import { useState } from "react";

export default function QuizQuestionAnswer({ answers = [] }) {
    const [isShowing, setIsShowing] = useState(false);
    const toggleAnswers = () => {
        setIsShowing(!isShowing);
    };

    return isShowing === false ? (
        <i onClick={toggleAnswers} className="bi bi-eye-slash-fill"></i>
    ) : (
        <div>
            <i onClick={toggleAnswers} className="bi bi-eye-fill"></i>
            <ul className="list-disc">
                {answers.map((answer, index) => (
                    <li key={index} className="bg-white rounded ">
                        <span>{answer.content}</span>{" "}
                        {answer.correct == 1 ? (
                            <i className="bi bi-check2-circle text-teal-600"></i>
                        ) : (
                            <></>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
