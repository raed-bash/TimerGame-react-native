import { useSyncExternalStore } from "react";
import { AsyncStorageHelpers } from "@/utils";
import { PlayerNames, PlayerTimers, PlayerType } from "@/types";

export type Turn = {
  /** Whose time was draining during this turn */
  player: PlayerType;
  /** Active (unpaused) seconds the turn lasted */
  duration: number;
};

export type GameRecord = {
  id: string;
  startedAt: number;
  endedAt: number;
  players: PlayerNames;
  winner: PlayerType;
  topic: string;
  gameTimer: number;
  finalTimers: PlayerTimers;
  turns: Turn[];
};

const KEY = "history";
const MAX_RECORDS = 200;

let records: GameRecord[] = [];
const listeners = new Set<() => void>();
const commit = (next: GameRecord[]) => {
  records = next;
  listeners.forEach((l) => l());
  AsyncStorageHelpers.setItem(KEY, JSON.stringify(records));
};

// Stored data may be from an older build or corrupted: keep only well-formed records.
const isRecord = (r: any): r is GameRecord =>
  r &&
  typeof r.id === "string" &&
  typeof r.startedAt === "number" &&
  Array.isArray(r.players) &&
  (r.winner === 0 || r.winner === 1) &&
  Array.isArray(r.turns);

export async function loadHistory() {
  try {
    const raw = await AsyncStorageHelpers.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    records = Array.isArray(parsed) ? parsed.filter(isRecord) : [];
  } catch {
    records = [];
  }
  listeners.forEach((l) => l());
}

export const addRecord = (r: GameRecord) => commit([r, ...records].slice(0, MAX_RECORDS));
export const removeRecord = (id: string) => commit(records.filter((r) => r.id !== id));
export const clearHistory = () => commit([]);

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** All finished games, newest first. */
export default function useHistory() {
  return useSyncExternalStore(subscribe, () => records);
}
