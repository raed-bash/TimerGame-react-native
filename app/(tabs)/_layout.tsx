import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import MainContext, { MainContextDefaultValue } from "@/contexts/MainContext";
import { useColorScheme } from "react-native";
import AsyncStorageHelpers from "@/utils/AsyncStorageHelpers";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const [gameTimer, setGameTimer] = useState<number>(
    MainContextDefaultValue.gameTimer
  );
  const [playerNames, setPlayerNames] = useState<[string, string]>(
    MainContextDefaultValue.playerNames
  );

  useEffect(() => {
    async function getStorage() {
      setGameTimer(
        parseInt(
          (await AsyncStorageHelpers.getItem("gameTimer")) ||
            MainContextDefaultValue.gameTimer.toString()
        )
      );

      setPlayerNames([
        (await AsyncStorageHelpers.getItem("player1Name")) ||
          MainContextDefaultValue.playerNames[0],
        (await AsyncStorageHelpers.getItem("player2Name")) ||
          MainContextDefaultValue.playerNames[1],
      ]);
    }
    getStorage();
  }, []);

  return (
    <MainContext.Provider
      value={{ gameTimer, setGameTimer, playerNames, setPlayerNames }}
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",

            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "settings" : "settings-outline"}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </MainContext.Provider>
  );
}
