# Cursor Best Practice (Node + React) — Real-Time Feed Example

This lightweight codebase demonstrates **cursor pagination best practices** for a practical scenario:

- You have an **admin/activity feed**
- New events are coming in real time
- Users click **Load more** to browse older records
- You want to avoid duplicate/missing records caused by offset-based paging

---

## Why cursor pagination here?

For frequently changing data (new rows inserted at the top), `offset + limit` can shift records between requests.

**Cursor pagination best practice:**
1. Use a **stable sort key** (e.g., `id DESC` or `createdAt DESC + id`).
2. Return a `nextCursor` from the last item in the current page.
3. Query next page by `WHERE id < cursor`.
4. Return `hasMore` for clear UX control.
5. In production, use **opaque cursors** (encoded/signed token), not raw IDs.

---

## Project structure

- `src/server.js` — Node/Express API with cursor endpoint
- `src/data.js` — in-memory event records + simulated new event inserts
- `src/client/App.jsx` — React snippet showing initial load, load more, and simple real-time merge strategy
- `src/client/api.js` — API calls
- `src/index.js` — minimal entry note

---

## API contract

### `GET /api/feed?cursor=<id>&limit=<n>`

Response:
```json
{
  "items": [],
  "pageInfo": {
    "nextCursor": 97,
    "hasMore": true
  }
}
```

### `POST /api/feed/simulate-new`
Creates a new top event (for demo/testing real-time behavior).

---

## Run (backend)

```bash
npm install
npm run server
```

Server starts at: `http://localhost:4000`

---

## React usage guidance

`src/client/App.jsx` is a practical snippet you can drop into your React app.

What it demonstrates:
- Initial fetch (`cursor = null`)
- Incremental loading (`cursor = nextCursor`)
- Simple real-time handling:
  - poll/simulate new events
  - prepend unseen items
  - keep existing paged content stable

---

## Real-world guidance to resolve common issues

1. **Duplicate records in UI**
   - Keep a set/map by item ID on client and merge safely.

2. **Missing records while data changes**
   - Use cursor strategy (`id < cursor`) instead of offset pages.

3. **Unstable ordering**
   - Ensure deterministic ordering in DB query:
     - `ORDER BY created_at DESC, id DESC`

4. **Security/abuse concerns**
   - Make cursor opaque and signed.
   - Validate limit max (already shown in API).

5. **Large scale optimization**
   - Index sort/filter columns.
   - Prefer keyset pagination queries over deep offsets.

---

## Next improvements (optional)

- Replace polling with WebSocket/SSE for true push updates
- Persist data in PostgreSQL/MySQL
- Encode cursor as base64 JSON with signature
- Add tests for pagination edge cases

---

This is intentionally small and interview/demo friendly while still modeling a **real-time production-like pagination problem** and the correct direction to solve it.