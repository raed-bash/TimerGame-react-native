import { fetchSubjects, pickSubject } from "../useSubject";
import localSubjects from "@/data/subjects.json";

it("never repeats the previous topic", () => {
  for (let i = 0; i < 50; i++) expect(pickSubject(["دول", "حيوانات"], "دول")).toBe("حيوانات");
  expect(pickSubject(["دول"], "دول")).toBe("دول");
});

it("uses the remote list, dropping junk entries", async () => {
  global.fetch = jest.fn().mockResolvedValue({ json: async () => ["فواكه", 3, "", null] });
  expect(await fetchSubjects()).toEqual(["فواكه"]);
});

it("falls back to the bundled list when offline or invalid", async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error("offline"));
  expect(await fetchSubjects()).toBe(localSubjects);
  global.fetch = jest.fn().mockResolvedValue({ json: async () => ({ not: "an array" }) });
  expect(await fetchSubjects()).toBe(localSubjects);
});
