import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toSlug(str: string) {
  return str
    .toLocaleLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

export function formatBytes(bytes: number, decimals = 2): string {
  // Check if bytes are 0, then return '0 Bytes'
  if (bytes === 0) return "0 Bytes";

  // Define the unit sizes
  const k = 1024;
  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  // Calculate the index for the unit to be used
  const index = Math.floor(Math.log(bytes) / Math.log(k));

  // Calculate the size in the appropriate unit
  const sizeInUnit = bytes / Math.pow(k, index);

  // Return formatted string with appropriate unit and decimals
  return `${sizeInUnit.toFixed(decimals)} ${units[index]}`;
}
