import { PropsWithChildren } from "react";
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/hooks/useColorScheme";
import useTranslation from "@/hooks/useTranslation";
import { Accent } from "@/constants/Colors";

export type IconName = React.ComponentProps<typeof Ionicons>["name"];

export function Card({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  const theme = useTheme();
  return <View style={[styles.card, { backgroundColor: theme.surface }, style]}>{children}</View>;
}

export function CardTitle({ children }: { children: string }) {
  const theme = useTheme();
  const { isRTL } = useTranslation();
  return (
    <Text
      style={[
        styles.cardTitle,
        // letterSpacing breaks Arabic letter joining
        { color: theme.icon, alignSelf: isRTL ? "flex-end" : "flex-start", letterSpacing: isRTL ? 0 : 1.5 },
      ]}
    >
      {children}
    </Text>
  );
}

export function Chip(props: { selected: boolean; label: string; icon?: IconName; onPress: () => void }) {
  const theme = useTheme();
  const { selected, label, icon, onPress } = props;
  const fg = selected ? "#fff" : theme.text;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        { borderColor: selected ? Accent : theme.icon, backgroundColor: selected ? Accent : "transparent" },
        pressed && { opacity: 0.6 },
      ]}
    >
      {icon && <Ionicons name={icon} size={16} color={fg} />}
      <Text style={{ color: fg, fontWeight: "600" }}>{label}</Text>
    </Pressable>
  );
}

export function Segmented<V extends string>(props: {
  value: V;
  onChange: (v: V) => void;
  options: { value: V; label: string; icon?: IconName }[];
}) {
  return (
    <View style={styles.wrapRow}>
      {props.options.map((o) => (
        <Chip
          key={o.value}
          selected={o.value === props.value}
          label={o.label}
          icon={o.icon}
          onPress={() => props.onChange(o.value)}
        />
      ))}
    </View>
  );
}

export function IconButton(props: {
  icon: IconName;
  label: string;
  onPress: () => void;
  color?: string;
  size?: number;
  disabled?: boolean;
}) {
  const theme = useTheme();
  const { icon, label, onPress, disabled, size = 44 } = props;
  const color = props.color ?? theme.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => [
        styles.iconBtn,
        { width: size, height: size, borderRadius: size / 2, borderColor: color },
        { opacity: disabled ? 0.3 : pressed ? 0.5 : 1 },
      ]}
    >
      <Ionicons name={icon} size={size / 2} color={color} />
    </Pressable>
  );
}

export function PrimaryButton(props: {
  label: string;
  onPress: () => void;
  icon?: IconName;
  color?: string;
  outline?: boolean;
}) {
  const theme = useTheme();
  const { label, onPress, icon, outline } = props;
  const color = props.color ?? Accent;
  const fg = outline ? color : "#fff";
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.primary,
        outline
          ? { borderWidth: 2, borderColor: color, backgroundColor: theme.background }
          : { backgroundColor: color },
        pressed && { opacity: 0.85 },
      ]}
    >
      {icon && <Ionicons name={icon} size={22} color={fg} />}
      <Text style={[styles.primaryText, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: "100%", maxWidth: 420, borderRadius: 20, padding: 18, gap: 14, alignItems: "center" },
  cardTitle: { fontSize: 13, fontWeight: "700" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  wrapRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  iconBtn: { borderWidth: 1.5, justifyContent: "center", alignItems: "center" },
  primary: {
    width: "100%",
    maxWidth: 420,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
  },
  primaryText: { fontSize: 18, fontWeight: "800" },
});
