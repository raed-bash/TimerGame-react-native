import { PlayerTimers, PlayerType } from "@/types";

export default class PlayerHelpers {
  public playerTimer: PlayerTimers;
  public oppositePlayer: PlayerType;
  public startPlayer: PlayerType;
  public gameTimer: number;

  constructor(
    playerTimer: PlayerTimers,
    startPlayer: PlayerType,
    gameTimer: number
  ) {
    this.playerTimer = PlayerHelpers.getNewPlayerTimers(playerTimer);
    this.startPlayer = startPlayer;
    this.oppositePlayer = PlayerHelpers.getOppositePlayer(startPlayer);
    this.gameTimer = gameTimer;
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

    if (playerTimer[startPlayer] > 0) {
      playerTimer[startPlayer] -= 0.01;
    }

    if (playerTimer[oppositePlayer] < this.gameTimer) {
      playerTimer[oppositePlayer] += 0.01;
    }
  }
}
