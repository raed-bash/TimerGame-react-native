import { ColorValue, Text, View } from "react-native";

export type TimerProps = {
  color: ColorValue;
  timer: number;
  myTurn?: boolean;
};

export default function Timer(props: TimerProps) {
  const { color, timer, myTurn } = props;

  return (
    <View
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50%",
        backgroundColor: myTurn ? "#70d340" : undefined,
        width: "100%",
      }}
    >
      <Text
        style={{
          color,
          fontSize: 30,
        }}
      >
        {timer.toFixed(2)}
      </Text>
    </View>
  );
}
