"use client";

import { useChat } from "./useChat";
import { Message } from "./type";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const {
    user,
    loadingUser,
    messages,
    conversations,
    activeChat,
    setActiveChat,
    input,
    setInput,
    loading,
    editingMessage,
    setEditingMessage,
    sendMessage,
    deleteMessage,
    startEditing,
    openActionId,
    setOpenActionId,
    loadMoreMessages,
    hasMoreMessages,
    loadingMore,
  } = useChat();

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const previousLength = useRef(messages.length);

  // Scroll only when switching chat
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
    setIsAtBottom(true);
  }, [activeChat]);

  // Scroll only when new messages arrive AND user is already at bottom
  useEffect(() => {
    if (
      isAtBottom &&
      messages.length > previousLength.current &&
      scrollContainerRef.current
    ) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    previousLength.current = messages.length;
  }, [messages, isAtBottom]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const isBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    setIsAtBottom(isBottom);

    if (el.scrollTop < 150 && hasMoreMessages && !loadingMore) {
      loadMoreMessages();
    }
  };

  if (loadingUser)
    return <div className="text-center p-20 text-gray-500">Loading user...</div>;
  if (!user) return <div className="text-center text-black p-20">Please log in</div>;

  const isSender = (msg: Message) =>
    (msg.is_admin && user.role === "admin") ||
    (!msg.is_admin && user.id === msg.user_id);

  return (
    <div>
    <div className="flex max-w-6xl shadow-2xl  mx-auto h-150 overflow-hidden mt-30 text-black relative"   style={{
    background: `linear-gradient(310deg, #008080 0%, rgba(255,255,255,0.17) 70%, rgba(255,255,255,0) 100%)`,
  }}>
      {/* LEFT SIDEBAR */}
      {user.role === "admin" && (
        <div className="w-1/3 min-w-[250px] max-w-[350px] border-r rounded border-gray-200 overflow-y-auto bg-[#00808024]">
          <div style={{
    background: `linear-gradient(310deg, #008080 0%, rgba(255,255,255,0.17) 70%, rgba(255,255,255,0) 100%)`,
  }}> 
          <h2 className="p-4 font-bold text-lg">Chats</h2></div>
          {conversations.map((c) => (
            <div
              key={c.user_id}
              className={`p-3 cursor-pointer hover:bg-[#00808010] ${
                activeChat === c.user_id ? "bg-[#00808024]" : ""
              }`}
              onClick={() => setActiveChat(c.user_id)}
            >
              <p className="font-semibold">{c.user_name}</p>
              <p className="text-sm text-gray-500 truncate">
                {c.last_message}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* RIGHT CHAT SECTION */}
      <div className="flex flex-col flex-grow rounded   relative">
        {/* SCROLLABLE MESSAGES */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-grow overflow-y-auto scrollbar-custom p-3 mb-2   rounded"
        >
          {hasMoreMessages && (
            <div className="text-center py-4">
              <button
                onClick={loadMoreMessages}
                disabled={loadingMore}
                className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 disabled:opacity-50"
              >
                {loadingMore ? "Loading..." : "Load more messages"}
              </button>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 p-3 rounded-lg max-w-[70%] relative break-words ${
                msg.is_admin
                  ? "bg-[#00808040] ml-auto text-right"
                  : "border text-black mr-auto text-left"
              }`}
            >
              <div className="whitespace-pre-wrap break-words text-left">
                {msg.message}
              </div>

              {/* Meta info + actions */}
              <div className="text-[10px] text-white mt-1 flex gap-2 items-center justify-end">
                <span>
                  {new Date(msg.created_at).toLocaleDateString("en-GB")}
                </span>
                <span>
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {isSender(msg) && (
                  <div className="relative inline-block">
                    <span
                      className="cursor-pointer px-1 font-extrabold text-black text-lg hover:text-gray-700"
                      onClick={() =>
                        setOpenActionId(
                          openActionId === msg.id ? null : msg.id
                        )
                      }
                    >
                      ⁝
                    </span>
                    {openActionId === msg.id && (
                      <div className="absolute right-0 mt-1 bg-white border shadow rounded text-xs flex flex-col z-10">
                        <button
                          onClick={() => startEditing(msg)}
                          className="px-2 py-1 text-yellow-500 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="px-2 py-1 hover:bg-gray-100 text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Floating scroll-to-bottom button */}
        {!isAtBottom && (
          <button
            className="absolute bottom-20 right-6 bg-[#508080] text-white w-10 h-10 rounded-full shadow-md hover:bg-[#008080] cursor-pointer flex items-center justify-center"
            onClick={() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo({
                  top: scrollContainerRef.current.scrollHeight,
                  behavior: "smooth",
                });
              }
              setIsAtBottom(true);
            }}
          >
            ↓
          </button>
        )}

        {/* Input */}
        <div className="flex gap-2 flex-shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), sendMessage())
            }
            className="flex-1 border rounded px-2 py-1 text-black"
            placeholder="Type a message..."
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            className="bg-white black px-3 rounded hover:bg-[#008080] cursor-pointer disabled:opacity-50"
            disabled={!input.trim() || loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
