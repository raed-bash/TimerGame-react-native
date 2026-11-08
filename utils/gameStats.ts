import type { GameRecord } from "@/hooks/useHistory";
import { PlayerNames, PlayerType } from "@/types";

export type PlayerStats = {
  /** Words said: every turn the player ended by tapping (the game's last turn timed out) */
  answers: number;
  avg: number | null;
  fastest: number | null;
  slowest: number | null;
};

export function playerStats(record: GameRecord, player: PlayerType): PlayerStats {
  const answered = record.turns
    .slice(0, -1)
    .filter((t) => t.player === player)
    .map((t) => t.duration);
  if (!answered.length) return { answers: 0, avg: null, fastest: null, slowest: null };
  return {
    answers: answered.length,
    avg: answered.reduce((a, b) => a + b, 0) / answered.length,
    fastest: Math.min(...answered),
    slowest: Math.max(...answered),
  };
}

export const playTime = (record: GameRecord) =>
  record.turns.reduce((sum, t) => sum + t.duration, 0);

const norm = (s: string) => s.trim().toLowerCase();

/** Wins for each of `names` across past games between exactly these two names, in either seat. */
export function headToHead(records: GameRecord[], names: PlayerNames): [number, number] {
  const [a, b] = names.map(norm);
  const result: [number, number] = [0, 0];
  for (const r of records) {
    const [p, q] = r.players.map(norm);
    if (!((p === a && q === b) || (p === b && q === a))) continue;
    const winner = norm(r.players[r.winner]);
    if (winner === a) result[0]++;
    else if (winner === b) result[1]++;
  }
  return result;
}

export function formatDate(ts: number, language: string) {
  try {
    return new Date(ts).toLocaleString(language === "ar" ? "ar" : "en", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    // Some JS engines lack full Intl support.
    return new Date(ts).toLocaleString();
  }
}

export type LeaderboardRow = { name: string; wins: number; games: number };

/** Players ranked by wins (then fewest games). Names group case-insensitively. */
export function leaderboard(records: GameRecord[]): LeaderboardRow[] {
  const rows = new Map<string, LeaderboardRow>();
  for (const r of records) {
    r.players.forEach((name, i) => {
      const key = norm(name);
      const row = rows.get(key) ?? { name: name.trim(), wins: 0, games: 0 };
      row.games++;
      if (r.winner === i) row.wins++;
      rows.set(key, row);
    });
  }
  return [...rows.values()].sort((a, b) => b.wins - a.wins || a.games - b.games);
}
