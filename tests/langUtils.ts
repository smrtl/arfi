import { describe, it, expect } from "@jest/globals";

import { isObjectEmpty } from "@/lib/utils/lang";

describe("isObjectEmpty", () => {
  it("should not crash with other types", () => {
    expect(isObjectEmpty(undefined)).toBeTruthy();
    expect(isObjectEmpty(null)).toBeTruthy();
    expect(isObjectEmpty([])).toBeTruthy();
  });

  it("should detect empty objects", () => {
    expect(isObjectEmpty({})).toBeTruthy();
  });

  it("should detect non empty objects", () => {
    expect(isObjectEmpty({ key: 1 })).toBeFalsy();
  });
});
