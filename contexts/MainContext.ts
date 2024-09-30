import { PlayerNames } from "@/types";
import { createContext } from "react";

type MainContextDefaultValue = {
  gameTimer: number;
  setGameTimer: React.Dispatch<React.SetStateAction<number>>;
  playerNames: PlayerNames;
  setPlayerNames: React.Dispatch<React.SetStateAction<PlayerNames>>;
};

export const MainContextDefaultValue: MainContextDefaultValue = {
  gameTimer: 5,
  setGameTimer: () => {},
  playerNames: ["Player 1", "Player 2"],
  setPlayerNames: () => {},
};
const MainContext = createContext<MainContextDefaultValue>(
  MainContextDefaultValue
);

export default MainContext;
