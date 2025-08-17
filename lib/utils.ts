import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simple environment helper; returns undefined if not set rather than throwing
export function requireEnv(name: string): string | undefined {
  return process.env[name];
}
