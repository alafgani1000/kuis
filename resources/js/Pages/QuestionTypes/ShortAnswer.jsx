export default function ShortAnswer({ question, onAnswering }) {
    const handleAnswer = (question, answerId) => {
        onAnswering(question, answerId);
    };

    return (
        <div key={question.id} className="">
            <div className="text-xl font-semibold">{question.question}</div>
            <div className="text-base mt-8 items-center grid">
                <input onChange={(e) => handleAnswer(question, e.target.value)} type="text" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
        </div>
    );
}
