const store: Record<string, string> = {};
jest.mock("@/utils", () => ({
  AsyncStorageHelpers: {
    setItem: async (k: string, v: string) => ((store[k] = v), true),
    getItem: async (k: string) => store[k] ?? null,
  },
}));

import React from "react";
import renderer, { act } from "react-test-renderer";
import usePreferences, { loadPreferences, setPreference } from "../usePreferences";
import useTranslation from "../useTranslation";

// Minimal renderHook on top of react-test-renderer.
function renderHook<T>(hook: () => T) {
  const result = { current: undefined as T };
  const Probe = () => ((result.current = hook()), null);
  act(() => {
    renderer.create(React.createElement(Probe));
  });
  return { result };
}

it("persists and broadcasts changes", () => {
  const { result } = renderHook(() => useTranslation());
  expect(result.current.t.settings).toBe("Settings");
  act(() => setPreference("language", "ar"));
  expect(result.current.t.settings).toBe("الإعدادات");
  expect(result.current.isRTL).toBe(true);
  expect(store.language).toBe("ar");
});

it("falls back to defaults for unknown stored values", async () => {
  store.theme = "purple";
  store.language = "fr";
  const { result } = renderHook(() => usePreferences());
  await act(loadPreferences);
  expect(result.current).toEqual({ theme: "system", language: "en", vibration: "on" });
});
