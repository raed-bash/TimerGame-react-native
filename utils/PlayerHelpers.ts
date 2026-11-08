import { PlayerTimers, PlayerType } from "@/types";

export default class PlayerHelpers {
  public playerTimer: PlayerTimers;
  public oppositePlayer: PlayerType;
  public startPlayer: PlayerType;
  public gameTimer: number;
  public step: number;

  /** @param step seconds elapsed since the last tick */
  constructor(
    playerTimer: PlayerTimers,
    startPlayer: PlayerType,
    gameTimer: number,
    step = 0.01
  ) {
    this.playerTimer = PlayerHelpers.getNewPlayerTimers(playerTimer);
    this.startPlayer = startPlayer;
    this.oppositePlayer = PlayerHelpers.getOppositePlayer(startPlayer);
    this.gameTimer = gameTimer;
    this.step = step;
    this.handleNewScore();
  }

  getPlayerTimer() {
    return this.playerTimer;
  }

  static getOppositePlayer(player: PlayerType) {
    return player === 0 ? 1 : 0;
  }

  static getNewPlayerTimers(playerTimer: PlayerTimers): PlayerTimers {
    return [this.parseTimer(playerTimer[0]), this.parseTimer(playerTimer[1])];
  }

  static parseTimer(playerTimer: number) {
    return parseFloat(playerTimer.toFixed(2));
  }

  handleNewScore() {
    const playerTimer = this.playerTimer;
    const startPlayer = this.startPlayer;
    const oppositePlayer = this.oppositePlayer;

    // Move time from the active player to the other; the total stays gameTimer.
    const moved = Math.max(0, Math.min(this.step, playerTimer[startPlayer]));
    playerTimer[startPlayer] = PlayerHelpers.parseTimer(playerTimer[startPlayer] - moved);
    playerTimer[oppositePlayer] = PlayerHelpers.parseTimer(
      Math.min(this.gameTimer, playerTimer[oppositePlayer] + moved)
    );
  }
}
