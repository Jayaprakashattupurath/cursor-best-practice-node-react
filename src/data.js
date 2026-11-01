const now = Date.now();

export const events = Array.from({ length: 120 }, (_, i) => {
  const id = 120 - i; // descending id gives stable order for cursor pagination
  return {
    id,
    type: id % 3 === 0 ? "PAYMENT" : id % 2 === 0 ? "LOGIN" : "ORDER",
    user: `user_${(id % 8) + 1}`,
    message: `Event #${id} generated for demo`,
    createdAt: new Date(now - i * 15000).toISOString()
  };
});

export function addNewEvent() {
  const maxId = events.length ? events[0].id : 0;
  const id = maxId + 1;
  const record = {
    id,
    type: "ORDER",
    user: `user_${(id % 8) + 1}`,
    message: `New real-time event #${id}`,
    createdAt: new Date().toISOString()
  };

  // prepend as newest item
  events.unshift(record);
  return record;
}