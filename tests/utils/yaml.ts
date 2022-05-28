import { describe, it, expect } from "@jest/globals";

import toYaml from "@/lib/utils/yaml";

const stripMargin = (value: string, marker: string = "+ ") =>
  value
    .split("\n")
    .map((row) => {
      const pos = row.indexOf(marker);
      if (pos > -1) return row.substring(pos + marker.length, row.length);
      return null;
    })
    .filter((row) => row !== null)
    .join("\n");

describe("toYaml", () => {
  it("simple types", () => {
    expect(toYaml(null)).toBe("null");
    expect(toYaml(1)).toBe("1");
    expect(toYaml(23.23)).toBe("23.23");
    expect(toYaml(true)).toBe("true");
    expect(toYaml(false)).toBe("false");
    expect(toYaml("hello")).toBe("hello");
    expect(toYaml("hello:world")).toBe('"hello:world"');
    expect(toYaml('hello"world')).toBe('"hello\\"world"');
    expect(toYaml("hello\nworld")).toBe('"hello\\nworld"');
    expect(toYaml("hello\x01world")).toBe('"hello\\x01world"');
    expect(toYaml("null")).toBe('"null"');
    expect(toYaml("false")).toBe('"false"');
  });

  it("nested arrays", () => {
    expect(toYaml([1, 2, [3, 4, [5, 6], [7, 8, [9, 10]]], 11])).toBe(
      stripMargin(`
        + - 1
        + - 2
        + - - 3
        +   - 4
        +   - - 5
        +     - 6
        +   - - 7
        +     - 8
        +     - - 9
        +       - 10
        + - 11
        + `)
    );
  });

  it("nested objects", () => {
    expect(
      toYaml({
        type: "box",
        item: {
          type: "box",
          item: {
            type: "box",
            item: { type: "leaf" },
            meta: {
              value: 1,
            },
          },
          meta: {
            value: 1,
          },
        },
        meta: {
          value: 1,
        },
      })
    ).toBe(
      stripMargin(`
        + type: box
        + item:
        +   type: box
        +   item:
        +     type: box
        +     item:
        +       type: leaf
        +     meta:
        +       value: 1
        +   meta:
        +     value: 1
        + meta:
        +   value: 1
        + `)
    );
  });

  it("complex object", () => {
    const yaml = toYaml({
      json: ["rigid", "better for data interchange", [1, 2, 3]],
      yaml: ["slim and flexible", "better for configuration"],
      object: {
        key: "value",
        array: [{ null_value: null }, { boolean: true }, { integer: 1 }],
      },
      paragraph: "Blank lines denote\nparagraph breaks\n",
      content: "Or we\ncan auto\nconvert line breaks\nto save space",
      string: "1e14",
    });
    const expected =
      "json:\n  - rigid\n  - better for data interchange\n  - - 1\n    - 2\n    - 3\n" +
      "yaml:\n  - slim and flexible\n  - better for configuration\n" +
      "object:\n  key: value\n  array:\n    - null_value: null\n    - boolean: true\n    - integer: 1\n" +
      "paragraph: |\n  Blank lines denote\n  paragraph breaks\n" +
      "content: |-\n  Or we\n  can auto\n  convert line breaks\n  to save space\n" +
      'string: "1e14"\n';
    expect(yaml).toBe(expected);
  });
});
