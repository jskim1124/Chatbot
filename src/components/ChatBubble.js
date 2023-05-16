export const ChatBubble = ({message}) => {
    return (
        <div
            className={`flex flex-col ${
            message.role ==="assistant"
            ? "items-start":"items-end"
        }`}
        >
            <div
            className={`border rounded flex items-center ${
                message.role === "assistant"
                ? "bg-neutral-200 text-neutral-900"
                : "bg-blue-500 text-white"
            } rounded-2x1 px-3 py-2 max-w-[67%] whitespace-pre-wrap`}
            style={{overflowWrap:"anywhere"}}
            >
                {message.content}
            </div>
        </div>
    );
};