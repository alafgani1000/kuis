export default function Alert({ message, className = "", ...props }) {
    return message ? (
        <div {...props} className={"text-base pt-4 px-2 " + className}>
            {message}
        </div>
    ) : null;
}
