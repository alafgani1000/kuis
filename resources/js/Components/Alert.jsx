export default function Alert({ message, className = "", ...props }) {
    return message ? (
        <div {...props} className={"text-base " + className}>
            {message}
        </div>
    ) : null;
}
