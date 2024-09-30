import MainContext from "@/contexts/MainContext";
import { PlayerTimers } from "@/types";
import { useContext, useEffect } from "react";
type useSelectWinnerProps = {
  /**
   * Callback function triggered when a winner is selected.
   *
   * @param winner - The number of the winner (0 for first player, 1 for second player).
   */
  onWinner: (winner: 0 | 1) => void;
  /**
   * Player's timers
   */
  playerTimers: PlayerTimers;
};

export default function useSelectWinner({
  onWinner,
  playerTimers,
}: useSelectWinnerProps) {
  const { gameTimer } = useContext(MainContext);

  useEffect(() => {
    if (playerTimers[0] >= gameTimer) {
      onWinner(0);
    } else if (playerTimers[1] >= gameTimer) {
      onWinner(1);
    }
  }, [playerTimers]);
}
