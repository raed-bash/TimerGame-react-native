import { PropsWithChildren, useEffect, useState } from "react";
import MainContext, { MainContextDefaultValue } from "./MainContext";
import { AsyncStorageHelpers } from "@/utils";
import { PlayerNames } from "@/types";

export type MainSettings = { gameTimer: number; playerNames: PlayerNames };

export async function loadMainSettings(): Promise<MainSettings> {
  const defaults = MainContextDefaultValue;
  const timer = parseInt((await AsyncStorageHelpers.getItem("gameTimer")) ?? "");
  return {
    // Older builds could store "NaN".
    gameTimer: timer >= 2 ? timer : defaults.gameTimer,
    playerNames: [
      (await AsyncStorageHelpers.getItem("player1Name")) || defaults.playerNames[0],
      (await AsyncStorageHelpers.getItem("player2Name")) || defaults.playerNames[1],
    ],
  };
}

/**
 * Holds names + timer for every screen. Values are loaded before mount (see app/_layout),
 * so the persist effects below can never overwrite saved values with defaults.
 */
export default function MainProvider({ initial, children }: PropsWithChildren<{ initial: MainSettings }>) {
  const [gameTimer, setGameTimer] = useState(initial.gameTimer);
  const [playerNames, setPlayerNames] = useState<PlayerNames>(initial.playerNames);

  useEffect(() => {
    AsyncStorageHelpers.setItem("gameTimer", gameTimer.toString());
  }, [gameTimer]);

  useEffect(() => {
    AsyncStorageHelpers.setItem("player1Name", playerNames[0]);
    AsyncStorageHelpers.setItem("player2Name", playerNames[1]);
  }, [playerNames]);

  return (
    <MainContext.Provider value={{ gameTimer, setGameTimer, playerNames, setPlayerNames }}>
      {children}
    </MainContext.Provider>
  );
}
