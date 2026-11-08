import { useEffect, useRef, useState } from "react";
import localSubjects from "@/data/subjects.json";

// Edit data/subjects.json on GitHub to change topics without shipping an app update.
const SUBJECTS_URL =
  "https://raw.githubusercontent.com/raed-bash/TimerGame-react-native/main/data/subjects.json";

export async function fetchSubjects(): Promise<string[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(SUBJECTS_URL, { signal: controller.signal });
    const data: unknown = await res.json();
    // Remote content is untrusted: keep only non-empty strings.
    const list = Array.isArray(data)
      ? data.filter((s): s is string => typeof s === "string" && s.trim() !== "")
      : [];
    return list.length ? list : localSubjects;
  } catch {
    return localSubjects; // offline or bad response
  } finally {
    clearTimeout(timeout);
  }
}

export function pickSubject(list: string[], previous?: string) {
  const choices = list.length > 1 ? list.filter((s) => s !== previous) : list;
  return choices[Math.floor(Math.random() * choices.length)];
}

export default function useSubject() {
  const listRef = useRef<string[]>(localSubjects);
  const [subject, setSubject] = useState(() => pickSubject(localSubjects));

  useEffect(() => {
    // Don't swap the topic under players mid-game; the next round uses the remote list.
    fetchSubjects().then((list) => (listRef.current = list));
  }, []);

  const nextSubject = () => setSubject((s) => pickSubject(listRef.current, s));

  return { subject, nextSubject };
}
