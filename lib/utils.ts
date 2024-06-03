import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

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

export function getJoinedAtString(date: Date): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `Joined ${month} ${year}`;
}

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}
export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    },
  );
}

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => delete currentUrl[key]);

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    },
  );
}

export const debounce = (
  func: (...args: any) => void,
  timeout: number,
): ((...args: Parameters<any>) => void) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<any>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(null, args);
    }, timeout);
  };
};
