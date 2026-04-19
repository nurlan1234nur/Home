// Real API service — all calls go to the backend via /api/v1/*
// Vite proxies /api → http://localhost:3001 in development

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string) {
  const data = await request<{ user: any }>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return data.user;
}

export async function signup(name: string, email: string, password: string, inviteCode: string) {
  const data = await request<{ user: any }>("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password, inviteCode }),
  });
  return data.user;
}

export async function getMe() {
  const data = await request<{ user: any }>("/api/v1/me");
  return data.user;
}

export async function logout() {
  await request("/api/v1/auth/logout", { method: "POST" });
}

export async function forgotPassword(email: string) {
  return request("/api/v1/auth/forgot", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, password: string) {
  return request("/api/v1/auth/reset", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

// ─── Me ──────────────────────────────────────────────────────────────────────

export async function updateNickname(nickname: string) {
  const data = await request<{ user: any }>("/api/v1/me/nickname", {
    method: "PATCH",
    body: JSON.stringify({ nickname }),
  });
  return data.user;
}

export async function updateAvatar(avatar: string) {
  const data = await request<{ user: any }>("/api/v1/me/avatar", {
    method: "PATCH",
    body: JSON.stringify({ avatar }),
  });
  return data.user;
}

export async function changePassword(currentPassword: string, newPassword: string) {
  return request("/api/v1/me/password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

// ─── Today / Duties ──────────────────────────────────────────────────────────

export async function getTodayDuties() {
  return request<any[]>("/api/v1/today");
}

export async function markDutyDone(dutyId: string) {
  return request<any>(`/api/v1/assignments/${dutyId}/done`, { method: "POST" });
}

// ─── Day Feed ────────────────────────────────────────────────────────────────

export async function getDayFeed(date: string) {
  return request<any[]>(`/api/v1/day/${date}`);
}

export async function addNote(date: string, text: string) {
  return request<any>(`/api/v1/day/${date}`, {
    method: "POST",
    body: JSON.stringify({ type: "note", text }),
  });
}

export async function addCheckin(date: string) {
  return request<any>(`/api/v1/day/${date}`, {
    method: "POST",
    body: JSON.stringify({ type: "checkin", text: "Checked in" }),
  });
}

export async function editEntry(date: string, entryId: string, text: string) {
  return request<any>(`/api/v1/day/${date}/entries/${entryId}`, {
    method: "PUT",
    body: JSON.stringify({ text }),
  });
}

export async function deleteEntry(date: string, entryId: string) {
  return request(`/api/v1/day/${date}/entries/${entryId}`, { method: "DELETE" });
}

// ─── Upload ──────────────────────────────────────────────────────────────────

export async function uploadPhoto(file: File, caption: string, _isCheckin: boolean) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/v1/upload", {
    method: "POST",
    credentials: "include",
    body: form,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Upload failed");
  }

  const { url } = await res.json();
  const today = new Date().toISOString().split("T")[0];

  return request<any>(`/api/v1/day/${today}`, {
    method: "POST",
    body: JSON.stringify({ type: "photo", url, caption }),
  });
}

// ─── Comments ────────────────────────────────────────────────────────────────

export async function getComments(entryId: string) {
  return request<any[]>(`/api/v1/entries/${entryId}/comments`);
}

export async function addComment(entryId: string, text: string) {
  return request<any>(`/api/v1/entries/${entryId}/comments`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export async function deleteComment(entryId: string, commentId: string) {
  return request(`/api/v1/entries/${entryId}/comments/${commentId}`, { method: "DELETE" });
}

// ─── Messages ────────────────────────────────────────────────────────────────

export async function getConversations() {
  return request<any[]>("/api/v1/messages");
}

export async function getMessages(userId: string) {
  return request<any[]>(`/api/v1/messages/${userId}`);
}

export async function sendMessage(userId: string, text: string) {
  return request<any>(`/api/v1/messages/${userId}`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

// ─── Calendar ────────────────────────────────────────────────────────────────

export async function getCalendarData(year: number, month: number) {
  return request<{ daysWithNotes: string[]; daysWithPhotos: string[]; daysWithCheckins: string[] }>(
    `/api/v1/calendar/${year}/${month}`
  );
}

// ─── Members (admin) ─────────────────────────────────────────────────────────

export async function getMembers() {
  return request<any[]>("/api/v1/members");
}

export async function removeMember(userId: string) {
  return request(`/api/v1/members/${userId}`, { method: "DELETE" });
}

export async function generateInviteCode() {
  return request<{ code: string }>("/api/v1/members/invite", { method: "POST" });
}

// ─── Rotations (admin) ───────────────────────────────────────────────────────

export async function getRotations() {
  return request<any[]>("/api/v1/rotations");
}

export async function createRotation(name: string, schedule: string, memberIds: string[]) {
  return request<any>("/api/v1/rotations", {
    method: "POST",
    body: JSON.stringify({ name, schedule, memberIds }),
  });
}

export async function deleteRotation(rotationId: string) {
  return request(`/api/v1/rotations/${rotationId}`, { method: "DELETE" });
}
