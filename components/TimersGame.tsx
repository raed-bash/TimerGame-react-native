import { useColorScheme, View } from "react-native";
import PlayerSection from "./PlayerSection";
import { useContext } from "react";
import MainContext from "@/contexts/MainContext";
import { useTimers } from "@/hooks";

export default function TimersGame() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const { playerNames } = useContext(MainContext);

  const { playerTimers, handleStartPlayer, startPlayer } = useTimers();

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <PlayerSection
        color="red"
        playerName={playerNames[1]}
        playerTimer={playerTimers[1]}
        playerPress={() => {
          handleStartPlayer(1);
        }}
        myTurn={startPlayer === 1}
        timerPosition="bottom"
      />
      <View
        style={{ borderWidth: 1, borderColor: isDarkMode ? "white" : "black" }}
      ></View>
      <PlayerSection
        color="blue"
        playerName={playerNames[0]}
        playerTimer={playerTimers[0]}
        playerPress={() => {
          handleStartPlayer(0);
        }}
        myTurn={startPlayer === 0}
        timerPosition="top"
      />
    </View>
  );
}
