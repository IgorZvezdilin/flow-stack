import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type intervals = {
  [date: string]: number;
};

export function getTimeStamp(createdAt: Date): string {
  const now = new Date();
  const diff = Math.abs(now.getTime() - createdAt.getTime()) / 1000; // Time difference in seconds

  const intervals: intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const unit in intervals) {
    const count = Math.floor(diff / intervals[unit]);
    if (count > 0) {
      return count === 1 ? `${count} ${unit} ago` : `${count} ${unit}s ago`;
    }
  }
  return "just now";
}

export function formatBigNumber(value: number): string {
  if (Math.abs(value) >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  } else if (Math.abs(value) >= 1e3) {
    return `${(value / 1e3).toFixed(1)}k`;
  } else {
    return value.toString();
  }
}
