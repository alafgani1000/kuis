import { useEffect } from "react";

export default function Score() {

    /**
     * delete local storage data
     *
     */
    const deleteLocalStorageData = () => {
        localStorage.removeItem("quiz" + quiz.id);
        localStorage.removeItem("quiz" + quiz.id + "_index");
        localStorage.removeItem("quiz" + quiz.id + "_skip");
        localStorage.removeItem("quiz" + quiz.id + "_current");
        localStorage.removeItem("quiz" + quiz.id + "_count_choosed");
        localStorage.removeItem("quizLastTimeChoice" + quiz.id);
        localStorage.removeItem("quizStartTime" + quiz.id);
    };

    useEffect(() => {
        deleteLocalStorageData()
    }, [])

    return <div>score</div>;
}
