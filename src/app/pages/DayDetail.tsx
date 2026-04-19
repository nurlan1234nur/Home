import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../components/Toast";
import * as api from "../services/api";
import { resolveAssetUrl } from "../services/api";
import { Card } from "../components/Card";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Spinner } from "../components/Spinner";
import { CommentSection } from "../components/CommentSection";

interface FeedEntry {
  id: string;
  type: "note" | "photo" | "checkin";
  text?: string;
  url?: string;
  caption?: string;
  author: { id: string; name: string; avatar?: string };
  createdAt: string;
  commentCount?: number;
}

export function DayDetail() {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [feed, setFeed] = useState<FeedEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (date) {
      loadFeed();
    }
  }, [date]);

  async function loadFeed() {
    if (!date) return;

    try {
      const data = await api.getDayFeed(date);
      setFeed(data);
    } catch (error) {
      showToast("Failed to load feed", "error");
    } finally {
      setIsLoading(false);
    }
  }

  function formatTime(dateString: string) {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (!date) {
    return null;
  }

  const formattedDate = format(new Date(date), "EEEE, MMMM d, yyyy");

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate("/calendar")}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">{formattedDate}</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : feed.length === 0 ? (
        <Card>
          <p className="text-center text-gray-400 py-8">No activity on this day</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {feed.map((entry) => (
            <Card key={entry.id}>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Avatar src={entry.author.avatar} name={entry.author.name} size="sm" />
                  <div>
                    <p className="font-medium text-sm">{entry.author.name}</p>
                    <p className="text-xs text-gray-400">{formatTime(entry.createdAt)}</p>
                  </div>
                </div>

                {entry.type === "note" && <p>{entry.text}</p>}

                {entry.type === "photo" && (
                  <>
                    <img src={resolveAssetUrl(entry.url) ?? undefined} alt={entry.caption} className="rounded-lg w-full" />
                    {entry.caption && <p>{entry.caption}</p>}
                    <CommentSection
                      entryId={entry.id}
                      commentCount={entry.commentCount ?? 0}
                    />
                  </>
                )}

                {entry.type === "checkin" && (
                  <p className="text-green-400">✅ Checked in</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
