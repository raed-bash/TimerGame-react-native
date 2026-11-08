import PlayerHelpers from "../PlayerHelpers";

const tick = (t: [number, number], player: 0 | 1, step: number) =>
  new PlayerHelpers(t, player, 10, step).getPlayerTimer();

it("moves elapsed time from the active player to the other", () => {
  expect(tick([5, 5], 0, 0.25)).toEqual([4.75, 5.25]);
  expect(tick([5, 5], 1, 1)).toEqual([6, 4]);
});

it("never goes below zero or above the game timer, and keeps the total", () => {
  const t = tick([0.1, 9.9], 0, 0.5);
  expect(t).toEqual([0, 10]);
  expect(tick(t, 0, 0.5)).toEqual([0, 10]);
});

it("does not mutate the input", () => {
  const input: [number, number] = [5, 5];
  tick(input, 0, 1);
  expect(input).toEqual([5, 5]);
});
