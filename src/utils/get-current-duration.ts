export function getCurrentDuration(startTime: string) {
  const start = new Date(startTime);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  let durationText = "";
  if (hours > 0) durationText += `${hours} hour${hours > 1 ? "s" : ""}`;
  if (hours > 0 && minutes > 0) durationText += " and ";
  if (minutes > 0) durationText += `${minutes} minute${minutes > 1 ? "s" : ""}`;
  if (!durationText) durationText = "less than a minute";
  return durationText;
}
