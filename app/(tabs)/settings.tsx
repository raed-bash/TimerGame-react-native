import { View } from "react-native";
import AppTextInput from "@/components/textInput/AppTextInput";
import { useSettings } from "@/hooks";

export default function Settings() {
  const {
    gameTimer,
    player1Name,
    player2Name,
    handleGameTimerChange,
    handlePlayer1NameChange,
    handlePlayer2NameChange,
  } = useSettings();

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        gap: 30,
      }}
    >
      <AppTextInput
        label="Player1 Name"
        value={player1Name}
        onChangeText={handlePlayer1NameChange}
        textProps={{ style: { color: "blue" } }}
        style={{ color: "blue" }}
      />
      <AppTextInput
        label="Player2 Name"
        value={player2Name}
        onChangeText={handlePlayer2NameChange}
        textProps={{ style: { color: "red" } }}
        style={{ color: "red" }}
      />
      <AppTextInput
        label="Game Timer"
        value={gameTimer ? gameTimer.toString() : ""}
        onChangeText={handleGameTimerChange}
      />
    </View>
  );
}
