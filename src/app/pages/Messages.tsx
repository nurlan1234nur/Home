import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../components/Toast";
import * as api from "../services/api";
import { Card } from "../components/Card";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Spinner } from "../components/Spinner";
import { Badge } from "../components/Badge";
import { Send } from "lucide-react";

interface Conversation {
  user: { id: string; name: string; avatar?: string };
  lastMessage: string;
  unreadCount: number;
  lastMessageTime: string;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
}

export function Messages() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadMessages(selectedUserId);
    }
  }, [selectedUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function loadConversations() {
    try {
      const data = await api.getConversations();
      setConversations(data);
      if (data.length > 0 && !selectedUserId) {
        setSelectedUserId(data[0].user.id);
      }
    } catch (error) {
      showToast("Failed to load conversations", "error");
    } finally {
      setIsLoadingConversations(false);
    }
  }

  async function loadMessages(userId: string) {
    setIsLoadingMessages(true);
    try {
      const data = await api.getMessages(userId);
      setMessages(data);
    } catch (error) {
      showToast("Failed to load messages", "error");
    } finally {
      setIsLoadingMessages(false);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!messageText.trim() || !selectedUserId) return;

    setIsSending(true);
    try {
      const newMessage = await api.sendMessage(selectedUserId, messageText);
      setMessages((prev) => [...prev, newMessage]);
      setMessageText("");
    } catch (error) {
      showToast("Failed to send message", "error");
    } finally {
      setIsSending(false);
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function formatTime(dateString: string) {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  const selectedConversation = conversations.find((c) => c.user.id === selectedUserId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Messages</h1>

      <div className="grid md:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <div className={`md:block ${selectedUserId ? "hidden" : "block"}`}>
          <Card className="h-full overflow-y-auto">
            {isLoadingConversations ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <button
                    key={conv.user.id}
                    onClick={() => setSelectedUserId(conv.user.id)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedUserId === conv.user.id
                        ? "bg-blue-500/20"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar src={conv.user.avatar} name={conv.user.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{conv.user.name}</p>
                          {conv.unreadCount > 0 && (
                            <Badge variant="primary" className="ml-2">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Chat Screen */}
        <div className={`md:col-span-2 md:block ${selectedUserId ? "block" : "hidden"}`}>
          {selectedUserId && selectedConversation ? (
            <Card className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
                <button
                  onClick={() => setSelectedUserId(null)}
                  className="md:hidden text-gray-400 hover:text-white"
                >
                  ←
                </button>
                <Avatar src={selectedConversation.user.avatar} name={selectedConversation.user.name} size="sm" />
                <h3 className="font-semibold">{selectedConversation.user.name}</h3>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {isLoadingMessages ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => {
                      const isOwn = message.senderId === user?.id;
                      const showDate =
                        index === 0 ||
                        formatDate(messages[index - 1].createdAt) !== formatDate(message.createdAt);

                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="text-center text-xs text-gray-500 my-4">
                              {formatDate(message.createdAt)}
                            </div>
                          )}
                          <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-[70%] px-4 py-2 rounded-lg ${
                                isOwn
                                  ? "bg-blue-600 text-white"
                                  : "bg-white/10 text-white"
                              }`}
                            >
                              <p>{message.text}</p>
                              <p className="text-xs mt-1 opacity-70">
                                {formatTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="flex space-x-2 pt-4 border-t border-white/10">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  style={{ fontSize: "16px" }}
                  rows={1}
                />
                <Button type="submit" disabled={!messageText.trim()} isLoading={isSending}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <p className="text-gray-400">Select a conversation to start messaging</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
