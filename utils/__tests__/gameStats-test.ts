import { headToHead, leaderboard, playerStats, playTime } from "../gameStats";
import type { GameRecord } from "@/hooks/useHistory";

const game = (over: Partial<GameRecord> = {}): GameRecord => ({
  id: "1",
  startedAt: 0,
  endedAt: 0,
  players: ["Ali", "Sara"],
  winner: 1,
  topic: "دول",
  gameTimer: 10,
  finalTimers: [0, 10],
  turns: [
    { player: 0, duration: 1 },
    { player: 1, duration: 2 },
    { player: 0, duration: 3 },
    { player: 1, duration: 0.5 },
    { player: 0, duration: 4 }, // timed out: not an answer
  ],
  ...over,
});

it("counts answered turns only, excluding the final timed-out turn", () => {
  expect(playerStats(game(), 0)).toEqual({ answers: 2, avg: 2, fastest: 1, slowest: 3 });
  expect(playerStats(game(), 1)).toEqual({ answers: 2, avg: 1.25, fastest: 0.5, slowest: 2 });
});

it("handles a player who never answered", () => {
  const g = game({ turns: [{ player: 0, duration: 5 }] });
  expect(playerStats(g, 0)).toEqual({ answers: 0, avg: null, fastest: null, slowest: null });
});

it("sums play time", () => {
  expect(playTime(game())).toBe(10.5);
});

it("counts head-to-head wins in either seat, ignoring case and spaces", () => {
  const records = [
    game({ players: ["Ali", "Sara"], winner: 1 }),
    game({ players: ["sara ", "ali"], winner: 1 }), // Ali won from the other seat
    game({ players: ["Ali", "Omar"], winner: 0 }), // different matchup
  ];
  expect(headToHead(records, ["Ali", "Sara"])).toEqual([1, 1]);
  expect(headToHead(records, ["Sara", "Ali"])).toEqual([1, 1]);
});

it("ranks players by wins across all matchups", () => {
  const records = [
    game({ players: ["Ali", "Sara"], winner: 1 }),
    game({ players: ["sara", "Omar"], winner: 0 }),
    game({ players: ["Ali", "Omar"], winner: 0 }),
  ];
  expect(leaderboard(records)).toEqual([
    { name: "Sara", wins: 2, games: 2 },
    { name: "Ali", wins: 1, games: 2 },
    { name: "Omar", wins: 0, games: 2 },
  ]);
});
