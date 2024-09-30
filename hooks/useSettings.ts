import MainContext from "@/contexts/MainContext";
import { AsyncStorageHelpers } from "@/utils";
import { useContext, useEffect } from "react";

export default function useSettings() {
  const { gameTimer, setGameTimer, playerNames, setPlayerNames } =
    useContext(MainContext);

  const handleGameTimerChange = (numString: string) => {
    const number = parseInt(numString);
    setGameTimer(number);
  };

  const handlePlayer1NameChange = (name: string) => {
    setPlayerNames((playerNames) => [name, playerNames[1]]);
  };

  const handlePlayer2NameChange = (name: string) => {
    setPlayerNames((playerNames) => [playerNames[0], name]);
  };

  useEffect(() => {
    async function setStorage() {
      await AsyncStorageHelpers.setItem("gameTimer", gameTimer.toString());
    }
    setStorage();
  }, [gameTimer]);

  useEffect(() => {
    async function setStorage() {
      await AsyncStorageHelpers.setItem("player1Name", playerNames[0]);

      await AsyncStorageHelpers.setItem("player2Name", playerNames[1]);
    }
    setStorage();
  }, [playerNames]);

  return {
    handleGameTimerChange,
    handlePlayer1NameChange,
    handlePlayer2NameChange,
    player1Name: playerNames[0],
    player2Name: playerNames[1],
    gameTimer,
  };
}
