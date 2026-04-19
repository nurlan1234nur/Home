import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../components/Toast";
import * as api from "../services/api";
import { Card } from "../components/Card";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Textarea } from "../components/Textarea";
import { Spinner } from "../components/Spinner";
import { Camera, Edit2, Trash2 } from "lucide-react";
import { CommentSection } from "../components/CommentSection";

interface Duty {
  id: string;
  label: string;
  status: "pending" | "done";
  assignedUser: { id: string; name: string; avatar?: string };
  completedAt?: string;
}

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

export function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [duties, setDuties] = useState<Duty[]>([]);
  const [feed, setFeed] = useState<FeedEntry[]>([]);
  const [isLoadingDuties, setIsLoadingDuties] = useState(true);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [photoCaption, setPhotoCaption] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [markingDutyId, setMarkingDutyId] = useState<string | null>(null);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    loadDuties();
    loadFeed();
  }, []);

  async function loadDuties() {
    try {
      const data = await api.getTodayDuties();
      setDuties(data);
    } catch (error) {
      showToast("Failed to load duties", "error");
    } finally {
      setIsLoadingDuties(false);
    }
  }

  async function loadFeed() {
    try {
      const data = await api.getDayFeed(new Date().toISOString().split("T")[0]);
      setFeed(data);
    } catch (error) {
      showToast("Failed to load feed", "error");
    } finally {
      setIsLoadingFeed(false);
    }
  }

  async function handleMarkDone(dutyId: string) {
    setMarkingDutyId(dutyId);
    try {
      await api.markDutyDone(dutyId);
      setDuties((prev) =>
        prev.map((d) =>
          d.id === dutyId ? { ...d, status: "done" as const, completedAt: new Date().toISOString() } : d
        )
      );
      showToast("Duty marked as done", "success");
    } catch (error) {
      showToast("Failed to mark duty", "error");
    } finally {
      setMarkingDutyId(null);
    }
  }

  async function handleAddNote() {
    if (!noteText.trim()) return;

    setIsAddingNote(true);
    try {
      const newNote = await api.addNote(new Date().toISOString().split("T")[0], noteText);
      setFeed((prev) => [newNote, ...prev]);
      setNoteText("");
      showToast("Note added", "success");
    } catch (error) {
      showToast("Failed to add note", "error");
    } finally {
      setIsAddingNote(false);
    }
  }

  async function handleCheckin() {
    setIsCheckingIn(true);
    try {
      const checkin = await api.addCheckin(new Date().toISOString().split("T")[0]);
      setFeed((prev) => [checkin, ...prev]);
      showToast("Checked in successfully", "success");
    } catch (error) {
      showToast("Failed to check in", "error");
    } finally {
      setIsCheckingIn(false);
    }
  }

  async function handleDeleteEntry(entryId: string) {
    const today = new Date().toISOString().split("T")[0];
    try {
      await api.deleteEntry(today, entryId);
      setFeed((prev) => prev.filter((e) => e.id !== entryId));
      showToast("Deleted", "success");
    } catch {
      showToast("Failed to delete", "error");
    }
  }

  function startEditing(entry: FeedEntry) {
    setEditingEntryId(entry.id);
    setEditingText(entry.text || entry.caption || "");
  }

  async function handleSaveEdit(entryId: string) {
    const today = new Date().toISOString().split("T")[0];
    setIsSavingEdit(true);
    try {
      await api.editEntry(today, entryId, editingText);
      setFeed((prev) =>
        prev.map((e) =>
          e.id === entryId
            ? { ...e, text: e.type !== "photo" ? editingText : e.text, caption: e.type === "photo" ? editingText : e.caption }
            : e
        )
      );
      setEditingEntryId(null);
      showToast("Updated", "success");
    } catch {
      showToast("Failed to update", "error");
    } finally {
      setIsSavingEdit(false);
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const photo = await api.uploadPhoto(file, photoCaption, false);
      setFeed((prev) => [photo, ...prev]);
      setPhotoCaption("");
      showToast("Photo uploaded", "success");
    } catch (error) {
      showToast("Failed to upload photo", "error");
    } finally {
      setIsUploadingPhoto(false);
    }
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diff < 1) return "just now";
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hr ago`;
    return date.toLocaleDateString();
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{today}</h1>
        <p className="text-gray-400 mt-1">
          Welcome back, {user?.name}
          {user?.role === "admin" && <Badge variant="info" className="ml-2">Admin</Badge>}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Today's Duties</h2>
        {isLoadingDuties ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : duties.length === 0 ? (
          <Card>
            <p className="text-center text-gray-400 py-8">No duties today 🎉</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {duties.map((duty) => (
              <Card key={duty.id}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{duty.label}</h3>
                    <Badge variant={duty.status === "done" ? "success" : "primary"}>
                      {duty.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Avatar src={duty.assignedUser.avatar} name={duty.assignedUser.name} size="sm" />
                    <span className="text-sm text-gray-400">{duty.assignedUser.name}</span>
                  </div>
                  {duty.status === "done" && duty.completedAt && (
                    <p className="text-xs text-green-400">Completed {formatTime(duty.completedAt)}</p>
                  )}
                  {duty.status === "pending" && duty.assignedUser.id === user?.id && (
                    <Button
                      onClick={() => handleMarkDone(duty.id)}
                      isLoading={markingDutyId === duty.id}
                      variant="primary"
                      className="w-full"
                    >
                      Mark Done
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Today's Activity</h2>

        <div className="space-y-4 mb-6">
          <Card>
            <Textarea
              placeholder="Add a note..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={2}
            />
            <div className="flex justify-end mt-2">
              <Button onClick={handleAddNote} isLoading={isAddingNote} disabled={!noteText.trim()}>
                Add Note
              </Button>
            </div>
          </Card>

          <Card>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleCheckin} isLoading={isCheckingIn} variant="secondary">
                ✅ Check In
              </Button>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={isUploadingPhoto}
                />
                <span className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors bg-white/10 hover:bg-white/20 text-white">
                  <Camera className="w-4 h-4 mr-2" />
                  {isUploadingPhoto ? "Uploading..." : "Upload Photo"}
                </span>
              </label>
            </div>
          </Card>
        </div>

        {isLoadingFeed ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-4">
            {feed.map((entry) => (
              <Card key={entry.id}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar src={entry.author.avatar} name={entry.author.name} size="sm" />
                      <div>
                        <p className="font-medium text-sm">{entry.author.name}</p>
                        <p className="text-xs text-gray-400">{formatTime(entry.createdAt)}</p>
                      </div>
                    </div>
                    {entry.author.id === user?.id && (
                      <div className="flex space-x-2">
                        {entry.type !== "checkin" && (
                          <button
                            onClick={() => startEditing(entry)}
                            className="text-gray-400 hover:text-blue-400 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {entry.type === "note" && (
                    editingEntryId === entry.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          style={{ fontSize: "16px" }}
                          rows={3}
                          autoFocus
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveEdit(entry.id)}
                            disabled={isSavingEdit}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
                          >
                            {isSavingEdit ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => setEditingEntryId(null)}
                            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p>{entry.text}</p>
                    )
                  )}

                  {entry.type === "photo" && (
                    <>
                      <img src={entry.url} alt={entry.caption} className="rounded-lg w-full" />
                      {editingEntryId === entry.id ? (
                        <div className="space-y-2">
                          <input
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ fontSize: "16px" }}
                            placeholder="Edit caption..."
                            autoFocus
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSaveEdit(entry.id)}
                              disabled={isSavingEdit}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
                            >
                              {isSavingEdit ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={() => setEditingEntryId(null)}
                              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        entry.caption && <p>{entry.caption}</p>
                      )}
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
    </div>
  );
}
