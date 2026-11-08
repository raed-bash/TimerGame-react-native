import MainContext from "@/contexts/MainContext";
import { useContext } from "react";

export default function useSettings() {
  const { gameTimer, setGameTimer, playerNames, setPlayerNames } =
    useContext(MainContext);

  // Clamped so the game never starts already won (0) or never ends.
  const handleGameTimerChange = (seconds: number) => {
    setGameTimer(Math.min(300, Math.max(2, Math.round(seconds))));
  };

  const handlePlayer1NameChange = (name: string) => {
    setPlayerNames((playerNames) => [name, playerNames[1]]);
  };

  const handlePlayer2NameChange = (name: string) => {
    setPlayerNames((playerNames) => [playerNames[0], name]);
  };

  const swapPlayers = () => setPlayerNames(([a, b]) => [b, a]);

  return {
    handleGameTimerChange,
    handlePlayer1NameChange,
    handlePlayer2NameChange,
    swapPlayers,
    setPlayerNames,
    player1Name: playerNames[0],
    player2Name: playerNames[1],
    gameTimer,
  };
}
