import { useState, useEffect, useCallback } from "react";
import { Message, Conversation, User } from "./type";

export const useChat = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Pagination
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  // Load user and token once
  useEffect(() => {
    try {
      const storedAdmin = localStorage.getItem("adminUser");
      const storedUser = localStorage.getItem("currentUser");
      const storedAdminToken = localStorage.getItem("adminToken");
      const storedUserToken = localStorage.getItem("token");

      if (storedAdmin && storedAdminToken) {
        setUser(JSON.parse(storedAdmin));
        setToken(storedAdminToken);
      } else if (storedUser && storedUserToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedUserToken);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  // Fetch messages
  const fetchMessages = useCallback(
    async (isLoadMore = false, pageNum = 1) => {
      if (!user || !token || (user.role === "admin" && !activeChat)) return;

      const url =
        user.role === "admin"
          ? `http://127.0.0.1:8000/api/chat/${activeChat}?page=${pageNum}`
          : `http://127.0.0.1:8000/api/chat/${user.id}?page=${pageNum}`;

      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        const newMessages = Array.isArray(data)
          ? data
          : Array.isArray(data.messages)
          ? data.messages
          : [];

        setMessages((prev) =>
          isLoadMore ? [...newMessages, ...prev] : newMessages
        );

        if (isLoadMore && newMessages.length < 20) setHasMoreMessages(false);
        if (!isLoadMore) setHasMoreMessages(newMessages.length === 20);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        if (!isLoadMore) setMessages([]);
      }
    },
    [user, token, activeChat]
  );

  // Load more messages
  const loadMoreMessages = useCallback(async () => {
    if (loadingMore || !hasMoreMessages) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      await fetchMessages(true, nextPage);
      setPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMoreMessages, page, fetchMessages]);

  // Poll for new messages
  useEffect(() => {
    if (!user || !token) return;
    setPage(1);
    fetchMessages(false, 1);

    const interval = setInterval(() => fetchMessages(false, 1), 3000);
    return () => clearInterval(interval);
  }, [user, token, activeChat, fetchMessages]);

  // Fetch conversations (for admin)
  const fetchConversations = useCallback(async () => {
    if (user?.role !== "admin" || !token) return;
    try {
      const res = await fetch("http://127.0.0.1:8000/api/conversations", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      const convList = Array.isArray(data.conversations)
        ? data.conversations
        : Array.isArray(data)
        ? data
        : [];

      setConversations(convList);
      if (!activeChat && convList.length > 0) {
        setActiveChat(convList[0].user_id);
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
      setConversations([]);
    }
  }, [user?.role, token, activeChat]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const startEditing = (msg: Message) => {
    setEditingMessage(msg);
    setInput(msg.message);
  };

  const sendMessage = async () => {
    if (!input.trim() || !user || !token || (user.role === "admin" && !activeChat)) return;

    setLoading(true);
    try {
      const url = editingMessage
        ? `http://127.0.0.1:8000/api/chat/${editingMessage.id}`
        : "http://127.0.0.1:8000/api/chat/send";

      const body: { message: string; user_id?: number } = { message: input };
      if (user.role === "admin" && !editingMessage) body.user_id = activeChat!;

      const res = await fetch(url, {
        method: editingMessage ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(await res.text());

      setEditingMessage(null);
      setInput("");
      fetchMessages(false, 1); // Refresh
    } catch (err) {
      console.error("Failed to send message:", err);
      alert(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/chat/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error(await res.text());
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Failed to delete message:", err);
      alert(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return {
    user,
    token,
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
    hasMoreMessages,
    loadingMore,
    loadMoreMessages,
  };
};
