import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const difference = now.getTime() - date.getTime();

  const hoursAgo = Math.floor(difference / (1000 * 60 * 60));

  if (hoursAgo < 1) {
    return '不到1小时前';
  } else {
    return `${hoursAgo}小时前`;
  }
}