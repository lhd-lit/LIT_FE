import { useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

type AILearningAssistantProps = {
  messages?: Message[];
  onSendMessage?: (message: string) => void;
  onClose?: () => void;
};

export function AILearningAssistant({
  messages = [],
  onSendMessage,
  onClose,
}: AILearningAssistantProps) {
  const [inputMessage, setInputMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && onSendMessage) {
      onSendMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  return (
    <aside className="w-80 bg-white border-l border-border flex flex-col h-[calc(100vh-4rem)] fixed right-0 top-16 z-40 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between z-10">
        <h2 className="heading-primary text-base">AI Learning Assistant</h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-xl text-text-secondary hover:text-text-primary"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        )}
      </div>

      <div className="flex-1 px-6 py-6 space-y-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-text-tertiary">
              <p className="font-inter text-sm">Start a conversation with AI</p>
              <p className="font-inter text-xs mt-2">Ask questions about the document</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.role === "user"
                      ? "bg-background-card text-text-primary"
                      : "bg-background text-text-primary"
                  }`}
                >
                  <p className="font-inter text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p
                    className={`font-inter text-xs mt-2 ${
                      message.role === "user" ? "text-text-primary" : "text-text-tertiary"
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a question about the text..."
              className="flex-1 px-3 py-2 rounded-lg border border-border text-sm font-inter text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-inter hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
}

