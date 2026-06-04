'use client';
/**
 * Tiny module-level pub/sub for the blog search query.
 *
 * The hero owns the search input and the feed owns the filter — they
 * live in separate Acts and don't share React state via props. A full
 * Context/Zustand store would be overkill for a single string, so this
 * is a 20-line subscribe/set store. Initial value is empty; the feed
 * subscribes on mount and re-renders when the hero updates.
 */
type Listener = (query: string) => void;

let currentQuery = '';
const listeners = new Set<Listener>();

export const blogSearch = {
  get current() {
    return currentQuery;
  },
  set(query: string) {
    if (currentQuery === query) return;
    currentQuery = query;
    listeners.forEach((fn) => fn(query));
  },
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
