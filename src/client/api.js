const API_BASE = "http://localhost:4000/api";

export async function fetchFeed(cursor = null, limit = 10) {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  params.set("limit", String(limit));

  const res = await fetch(`${API_BASE}/feed?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load feed");
  return res.json();
}

export async function simulateIncomingEvent() {
  const res = await fetch(`${API_BASE}/feed/simulate-new`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to simulate event");
  return res.json();
}