import { describe, expect, test } from "bun:test";
import {
  getAllCategories,
  getCategoryById,
  getDataset,
  getVisibleTree,
} from "../lib/categories";

describe("category dataset", () => {
  const data = getDataset();

  test("has schema metadata", () => {
    expect(data.schemaVersion).toBe(1);
    expect(data.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test("contains a substantial unique dataset", () => {
    const all = getAllCategories();
    const ids = new Set(all.map((item) => item.id));
    const codes = new Set(all.map((item) => item.code));
    expect(all.length).toBeGreaterThan(100);
    expect(ids.size).toBe(all.length);
    expect(codes.size).toBe(all.length);
  });

  test("codes are numeric strings", () => {
    for (const category of getAllCategories()) {
      expect(category.code).toMatch(/^\d{2,}$/);
      expect(category.name.trim().length).toBeGreaterThan(0);
    }
  });

  test("lookup by id works", () => {
    const first = getAllCategories()[0];
    expect(first).toBeDefined();
    expect(getCategoryById(first!.id)?.code).toBe(first!.code);
  });

  test("hiding a parent removes it from the visible tree", () => {
    const parent = getDataset().categories[0]!;
    const tree = getVisibleTree([parent.id]);
    expect(tree.some((item) => item.id === parent.id)).toBe(false);
  });

  test("empty ids are omitted from All but children stay visible", () => {
    const parent = getDataset().categories.find(
      (item) => item.children?.length,
    );
    expect(parent).toBeDefined();
    const child = parent!.children![0]!;
    const tree = getVisibleTree([], [parent!.id]);
    expect(tree.some((item) => item.id === parent!.id)).toBe(false);
    const visibleIds = tree.flatMap(function collect(item): string[] {
      return [item.id].concat(item.children?.flatMap(collect) ?? []);
    });
    expect(visibleIds).toContain(child.id);
  });

  test("an empty child is omitted while its parent remains", () => {
    const parent = getDataset().categories.find(
      (item) => item.children?.length,
    );
    expect(parent).toBeDefined();
    const child = parent!.children![0]!;
    const tree = getVisibleTree([], [child.id]);
    const shown = tree.find((item) => item.id === parent!.id);
    expect(shown).toBeDefined();
    expect(shown?.children?.some((item) => item.id === child.id)).toBe(false);
  });
});
