export function formatTime(value: number): string {
  // Convert the float value to total seconds
  const totalSeconds = Math.round(value);

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Format the time
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
