"use client";

export function useWindow() {
  return typeof window !== "undefined" ? window : null;
}