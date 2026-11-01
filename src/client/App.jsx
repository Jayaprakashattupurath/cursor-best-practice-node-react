import React, { useEffect, useState } from "react";
import { fetchFeed, simulateIncomingEvent } from "./api.js";

export default function App() {
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadInitial = async () => {
    setLoading(true);
    try {
      const data = await fetchFeed(null, 10);
      setItems(data.items);
      setNextCursor(data.pageInfo.nextCursor);
      setHasMore(data.pageInfo.hasMore);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!hasMore || !nextCursor) return;
    setLoading(true);
    try {
      const data = await fetchFeed(nextCursor, 10);
      setItems((prev) => [...prev, ...data.items]);
      setNextCursor(data.pageInfo.nextCursor);
      setHasMore(data.pageInfo.hasMore);
    } finally {
      setLoading(false);
    }
  };

  // naive "real-time" behavior: poll by simulating inserts every 15s, then refresh top page
  useEffect(() => {
    loadInitial();
    const timer = setInterval(async () => {
      await simulateIncomingEvent();
      const fresh = await fetchFeed(null, 10);
      setItems((prev) => {
        const known = new Set(prev.map((x) => x.id));
        const newOnTop = fresh.items.filter((x) => !known.has(x.id));
        return [...newOnTop, ...prev];
      });
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main style={{ fontFamily: "sans-serif", margin: "2rem auto", maxWidth: 700 }}>
      <h2>Activity Feed (Cursor Pagination)</h2>
      <p style={{ color: "#666" }}>
        Real use case: admin dashboard feed where new records arrive while users paginate.
      </p>

      <button onClick={loadInitial} disabled={loading}>Refresh</button>

      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ margin: "12px 0" }}>
            <strong>#{item.id}</strong> [{item.type}] {item.message}
            <div style={{ fontSize: 12, color: "#777" }}>
              {item.user} • {new Date(item.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>

      {hasMore ? (
        <button onClick={loadMore} disabled={loading}>
          {loading ? "Loading..." : "Load more"}
        </button>
      ) : (
        <p>No more items</p>
      )}
    </main>
  );
}