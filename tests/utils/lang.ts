import { describe, it, expect } from "@jest/globals";

import { isObjectEmpty, isPlainObject, isScalar, isArray } from "@/lib/utils/lang";

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

describe("isScalar", () => {
  it("should return false for null or undefined", () => {
    expect(isScalar(null)).toBeFalsy();
    expect(isScalar(undefined)).toBeFalsy();
  });

  it("should return false for scalar values", () => {
    expect(isScalar(32)).toBeTruthy();
    expect(isScalar("hello")).toBeTruthy();
    expect(isScalar(true)).toBeTruthy();
    expect(isScalar(false)).toBeTruthy();
  });

  it("should return false for array", () => {
    expect(isScalar([])).toBeFalsy();
    expect(isScalar([1, 2, 3])).toBeFalsy();
  });

  it("should return false for other objects", () => {
    expect(isScalar(new RegExp("."))).toBeFalsy();
  });

  it("should return true for plain objects", () => {
    expect(isScalar({})).toBeFalsy();
    expect(isScalar({ key: "value" })).toBeFalsy();
  });
});

describe("isArray", () => {
  it("should return false for null or undefined", () => {
    expect(isArray(null)).toBeFalsy();
    expect(isArray(undefined)).toBeFalsy();
  });

  it("should return false for scalar values", () => {
    expect(isArray(32)).toBeFalsy();
    expect(isArray("hello")).toBeFalsy();
  });

  it("should return false for array", () => {
    expect(isArray([])).toBeTruthy();
    expect(isArray([1, 2, 3])).toBeTruthy();
  });

  it("should return false for other objects", () => {
    expect(isArray(new RegExp("."))).toBeFalsy();
  });

  it("should return true for plain objects", () => {
    expect(isArray({})).toBeFalsy();
    expect(isArray({ key: "value" })).toBeFalsy();
  });
});

describe("isPlainObject", () => {
  it("should return false for null or undefined", () => {
    expect(isPlainObject(null)).toBeFalsy();
    expect(isPlainObject(undefined)).toBeFalsy();
  });

  it("should return false for scalar values", () => {
    expect(isPlainObject(32)).toBeFalsy();
    expect(isPlainObject("hello")).toBeFalsy();
  });

  it("should return false for array", () => {
    expect(isPlainObject([])).toBeFalsy();
    expect(isPlainObject([1, 2, 3])).toBeFalsy();
  });

  it("should return false for other objects", () => {
    expect(isPlainObject(new RegExp("."))).toBeFalsy();
  });

  it("should return true for plain objects", () => {
    expect(isPlainObject({})).toBeTruthy();
    expect(isPlainObject({ key: "value" })).toBeTruthy();
  });
});
