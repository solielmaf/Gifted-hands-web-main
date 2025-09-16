"use client";

import { useChat } from "./useChat";
import { Message, Conversation } from "./type";

export default function Chat() {
  const {
    user, loadingUser, messages, conversations, activeChat, setActiveChat,
    input, setInput, loading, editingMessage, setEditingMessage, sendMessage,
    deleteMessage, startEditing, openActionId, setOpenActionId
  } = useChat();

  if (loadingUser) return <div className="text-center p-20 text-gray-500">Loading user...</div>;
  if (!user) return <div className="text-center p-20">Please log in</div>;

  const isSender = (msg: Message) => (msg.is_admin && user.role === "admin") || (!msg.is_admin && user.id === msg.user_id);

  return (
    <div className="flex max-w-6xl mx-auto h-[800px]  overflow-hidden pt-30 text-black">
      {user.role === "admin" && (
        <div className="w-1/3  overflow-y-auto bg-[gray-50]">
          <h2 className="p-4 font-bold text-lg">Conversations</h2>
          {conversations.length === 0 ? <p className="text-gray-500 p-2">No conversations</p> :
            conversations.map(c => (
              <div key={c.user_id} className={`p-3 cursor-pointer hover:bg-[#00808010] ${activeChat===c.user_id?'bg-[#00808024]':''}`} onClick={()=>setActiveChat(c.user_id)}>
                <p className="font-semibold">{c.user_name}</p>
                <p className="text-sm text-gray-500 truncate">{c.last_message}</p>
              </div>
            ))
          }
        </div>
      )}

      <div className="flex flex-col flex-grow p-4 pl-0">
        <div className="flex-grow overflow-y-auto   p-2 mb-2 bg-gray-50">
          {messages.length===0 ? <div className="text-gray-500 text-center py-8">No messages yet.</div> :
            messages.map(msg=>(
              <div key={msg.id}   className={`mb-2  p-3 pl-8 rounded-lg max-w-[50%] relative  ${msg.is_admin?'bg-[#00808040] ml-auto text-right':'bg-gray-200 mr-auto text-left'}`}>
                {editingMessage?.id===msg.id ? (
                  <div className="flex gap-2">
                    <input value={input} onChange={e=>setInput(e.target.value)} className="border px-1 rounded flex-1 text-black"/>
                    <button onClick={()=>startEditing(msg)} className="text-green-600 text-xs hover:underline">Save</button>
                    <button onClick={()=>setEditingMessage(null)} className="text-gray-500 text-xs hover:underline">Cancel</button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="  whitespace-pre-wrap  break-words word-break text-left break-all">{msg.message}</span>

                  </div>
                )}
                <div className={`text-[10px] text-gray-500 mt-1 flex gap-1  items-center ${msg.is_admin?'justify-end':'justify-end'}`}>
                  <span>{new Date(msg.created_at).toLocaleDateString("en-GB")}</span>
                  <span>{new Date(msg.created_at).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</span>
                  {isSender(msg) && (
                      <div className="relative inline-block">
                        <span className="cursor-pointer px-1 text-black font-extrabold text-lg hover:text-gray-700" onClick={()=>setOpenActionId(openActionId===msg.id?null:msg.id)}>⁝</span>
                        {openActionId===msg.id && (
                          <div className="absolute right-0 mt-1 bg-white border shadow rounded text-xs flex flex-col z-10">
                            <button onClick={()=>startEditing(msg)} className="px-2 py-1 hover:bg-gray-100">Edit</button>
                            <button onClick={()=>deleteMessage(msg.id)} className="px-2 py-1 hover:bg-gray-100 text-red-500">Delete</button>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>
            ))
          }
        </div>

        <div className="flex gap-2">
          <input type="text" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(e.preventDefault(),sendMessage())} className="flex-1 border rounded px-2 py-1 text-black" placeholder="Type a message..." disabled={loading}/>
          <button onClick={sendMessage} className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600 disabled:opacity-50" disabled={!input.trim() || loading}>{loading ? "..." : "Send"}</button>
        </div>
      </div>
    </div>
  );
}
