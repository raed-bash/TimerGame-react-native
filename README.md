# Timer Game

A two-player, one-phone word game. Players sit on opposite sides of the phone, and the top half is turned upside down so the player opposite can read it.

## How to play

1. Enter both names on the menu, pick the game length and tap **Start game**.
2. A random topic appears (for example **دول**, countries).
3. Tap your half to start. While your time drains to your opponent, say a word from the topic, then tap to pass the turn.
4. The first player to hold the whole game time wins, and the ball falls on the loser.

## Features

- Start menu with player names, a swap button, game length and the head-to-head score
- Arabic topics loaded from [`data/subjects.json`](data/subjects.json) on GitHub, with a bundled copy for offline play
- Game history: every finished game with winner, topic, date, play time, per-player answers (average, fastest and slowest) and a turn-by-turn timeline, plus a leaderboard
- Pause, reset, new topic, haptics (can be turned off), and a ball animation
- English and Arabic, with light, dark or system theme

## Development

```bash
nvm use          # Node 20, from .nvmrc
npm install
npx expo start   # then open on a device, emulator or web
npm test         # Jest
npx tsc --noEmit # type check
```

To add or change topics, edit `data/subjects.json` and push. The app picks up the new list on its next launch.

### Project layout

| Path | What |
| --- | --- |
| `app/(tabs)/index.tsx` | Start menu |
| `app/game.tsx` → `components/TimersGame.tsx` | The game board |
| `app/(tabs)/history.tsx`, `app/history/[id].tsx` | History list and game details |
| `app/(tabs)/settings.tsx` | Theme, language, vibration and clearing history |
| `hooks/useTimers.ts` | Game clock, turns and the winner |
| `hooks/useHistory.ts`, `utils/gameStats.ts` | Saved games and their statistics |
| `constants/i18n.ts` | English and Arabic text |
