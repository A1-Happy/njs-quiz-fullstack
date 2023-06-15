import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function relativeDate(date: Date | string) {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));
  const seconds = Math.floor(diff / 1000);
  if (days > 0) return `${days} day` + (days > 1 ? "s" : "") + " ago";
  if (hours > 0) return `${hours} hour` + (hours > 1 ? "s" : "") + " ago";
  if (minutes > 0)
    return `${minutes} minute` + (minutes > 1 ? "s" : "") + " ago";
  if (seconds > 0)
    return `${seconds} second` + (seconds > 1 ? "s" : "") + " ago";
  return "just now";
}
