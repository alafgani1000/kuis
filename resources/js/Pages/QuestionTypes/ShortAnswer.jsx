export default function MultipleResponse({ question }) {
    return (
        <div key={question.id} className="text-xl">
            <div>{question.question} ?</div>
            <div>
                <input type="text" />
            </div>
        </div>
    );
}
