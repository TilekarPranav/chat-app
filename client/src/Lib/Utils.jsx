export function formatMessageDate(date) {
  if (!date) return "";
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "";
  return parsedDate.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
