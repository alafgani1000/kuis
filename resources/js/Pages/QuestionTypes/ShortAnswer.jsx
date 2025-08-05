export default function ShortAnswer({ question }) {
    return (
        <div key={question.id} className="">
            <div className="text-xl font-semibold">{question.question}</div>
            <div className="text-base mt-8 items-center grid">
                <input type="text" className="rounded-md" />
            </div>
        </div>
    );
}
