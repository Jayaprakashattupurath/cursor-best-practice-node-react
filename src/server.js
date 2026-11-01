import express from "express";
import cors from "cors";
import { events, addNewEvent } from "./data.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

/**
 * GET /api/feed?cursor=<id>&limit=<number>
 * Best practice:
 * - stable sort key (id DESC)
 * - opaque cursor in production (encoded token)
 * - return hasMore + nextCursor
 */
app.get("/api/feed", (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 10, 30);
  const cursor = req.query.cursor ? Number(req.query.cursor) : null;

  let slice;
  if (!cursor) {
    slice = events.slice(0, limit); // first page
  } else {
    const startIndex = events.findIndex((item) => item.id < cursor);
    slice = startIndex === -1 ? [] : events.slice(startIndex, startIndex + limit);
  }

  const last = slice[slice.length - 1];
  const nextCursor = last ? last.id : null;
  const hasMore = !!last && events.some((item) => item.id < last.id);

  res.json({
    items: slice,
    pageInfo: { nextCursor, hasMore }
  });
});

// small helper endpoint to simulate real-time inserts
app.post("/api/feed/simulate-new", (_req, res) => {
  const created = addNewEvent();
  res.status(201).json(created);
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});