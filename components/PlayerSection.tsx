import { StyleSheet, View } from "react-native";
import AppButton from "./button/AppButton";
import Timer from "./Timer";

type PlayerSectionProps = {
  playerName?: string;
  playerTimer?: number;
  myTurn?: boolean;
  playerPress?: () => void;
  color?: "red" | "blue";
  timerPosition?: "top" | "bottom";
};

export default function PlayerSection(props: PlayerSectionProps) {
  const {
    playerName = "Player",
    playerTimer = 0,
    myTurn = false,
    playerPress = () => {},
    color = "red",
    timerPosition = "bottom",
  } = props;

  const timerComp = <Timer color={color} timer={playerTimer} myTurn={myTurn} />;

  return (
    <View style={styles.playerSpace}>
      {timerPosition === "top" && timerComp}
      <AppButton
        onPress={() => {
          playerPress();
        }}
        color={color}
        style={styles.playerBtn}
        textProps={{
          style: {
            fontSize: 30,
          },
        }}
      >
        {playerName}
      </AppButton>
      {timerPosition === "bottom" && timerComp}
    </View>
  );
}
const styles = StyleSheet.create({
  playerSpace: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "50%",
  },
  playerBtn: {
    width: "100%",
    height: "50%",
  },
});
