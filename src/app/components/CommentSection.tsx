import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "./Toast";
import * as api from "../services/api";
import { Avatar } from "./Avatar";
import { Spinner } from "./Spinner";
import { MessageCircle, Trash2 } from "lucide-react";

interface Comment {
  id: string;
  text: string;
  author: { id: string; name: string; avatar?: string };
  createdAt: string;
}

interface CommentSectionProps {
  entryId: string;
  commentCount: number;
}

export function CommentSection({ entryId, commentCount: initialCount }: CommentSectionProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (isOpen && comments.length === 0) {
      loadComments();
    }
  }, [isOpen]);

  async function loadComments() {
    setIsLoading(true);
    try {
      const data = await api.getComments(entryId);
      setComments(data);
    } catch {
      showToast("Failed to load comments", "error");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSending(true);
    try {
      const comment = await api.addComment(entryId, newComment);
      setComments((prev) => [...prev, comment]);
      setCount((c) => c + 1);
      setNewComment("");
    } catch {
      showToast("Failed to send comment", "error");
    } finally {
      setIsSending(false);
    }
  }

  async function handleDelete(commentId: string) {
    try {
      await api.deleteComment(entryId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setCount((c) => Math.max(0, c - 1));
    } catch {
      showToast("Failed to delete comment", "error");
    }
  }

  function formatRelativeTime(dateString: string) {
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000);
    if (diff < 1) return "just now";
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hr ago`;
    return new Date(dateString).toLocaleDateString();
  }

  return (
    <div className="border-t border-white/10 pt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        <span>
          {count > 0 ? `${count} comment${count !== 1 ? "s" : ""}` : "Add comment"}
        </span>
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Spinner />
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-2">
                  <Avatar src={comment.author.avatar} name={comment.author.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium">{comment.author.name}</span>
                      <span className="text-xs text-gray-500 ml-2 shrink-0">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mt-0.5 break-words">{comment.text}</p>
                  </div>
                  {comment.author.id === user?.id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors shrink-0 mt-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-center space-x-2 mt-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              disabled={isSending}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              style={{ fontSize: "16px" }}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSending}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors min-w-[52px]"
            >
              {isSending ? "..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
