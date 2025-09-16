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

  const fetchMessages = useCallback(async () => {
    if (!user || !token || (user.role === "admin" && !activeChat)) return;
    const url = user.role === "admin"
      ? `http://127.0.0.1:8000/api/chat/${activeChat}`
      : `http://127.0.0.1:8000/api/chat/${user.id}`;

    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }});
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : Array.isArray(data.messages) ? data.messages : []);
    } catch (err) {
      console.error(err);
      setMessages([]);
    }
  }, [user, token, activeChat]);

  useEffect(() => {
    if (!user || !token) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [fetchMessages, user, token]);

  const fetchConversations = useCallback(async () => {
    if (user?.role !== "admin" || !token) return;
    try {
      const res = await fetch("http://127.0.0.1:8000/api/conversations", { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }});
      const data = await res.json();
      const convList = Array.isArray(data.conversations) ? data.conversations : Array.isArray(data) ? data : [];
      setConversations(convList);
      if (!activeChat && convList.length > 0) setActiveChat(convList[0].user_id);
    } catch (err) {
      console.error(err);
      setConversations([]);
    }
  }, [user?.role, token, activeChat]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  const startEditing = (msg: Message) => { setEditingMessage(msg); setInput(msg.message); };

  const sendMessage = async () => {
    if (!input.trim() || !user || !token || (user.role === "admin" && !activeChat)) return;
    setLoading(true);
    try {
      const url = editingMessage ? `http://127.0.0.1:8000/api/chat/${editingMessage.id}` : "http://127.0.0.1:8000/api/chat/send";
      const body: { message: string; user_id?: number } = { message: input };
      if (user.role === "admin" && !editingMessage) body.user_id = activeChat!;
      const res = await fetch(url, { method: editingMessage ? "PUT" : "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, Accept: "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(await res.text());
      setEditingMessage(null);
      setInput("");
      fetchMessages();
    } catch (err) { console.error(err); alert(err instanceof Error ? err.message : "Unknown error"); }
    finally { setLoading(false); }
  };

  const deleteMessage = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/chat/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }});
      if (!res.ok) throw new Error(await res.text());
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (err) { console.error(err); alert(err instanceof Error ? err.message : "Unknown error"); }
  };

  return { user, token, loadingUser, messages, conversations, activeChat, setActiveChat, input, setInput, loading, editingMessage, setEditingMessage, sendMessage, deleteMessage, startEditing, openActionId, setOpenActionId };
};
