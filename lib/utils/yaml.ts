import { isArray, isBoolean, isNullOrUndefined, isNumber, isPlainObject, isString } from "./lang";

const needEscaping = /(["\x00-\x1f\x7f])/;
const needQuotes =
  /^(0[ox])?[0-9]+(\.[0-9]+)?([eE]\+?[0-9]+)|[-:{}[\],&*#?|<>=!%@]|true|false|null|~$/;

const escapeMap = {
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "\t": "\\t",
  "\v": "\\v",
  "\0": "\\0",
  '"': '\\"',
  "\\": "\\\\",
};

const joinLines = (
  value: string[],
  prefix: string,
  hasInitialPrefix: boolean,
  hasLastNewLine: boolean
): string =>
  (hasInitialPrefix ? prefix : "") + value.join(`\n${prefix}`) + (hasLastNewLine ? "\n" : "");

const serialize = (
  value: any,
  prefix: string = "",
  hasInitialPrefix: boolean = true,
  hasLastNewLine: boolean = true
): string => {
  if (isNullOrUndefined(value)) return "null";
  if (isBoolean(value)) return value ? "true" : "false";
  if (isNumber(value)) return String(value);

  if (isString(value)) {
    if (!hasLastNewLine && /\n/.test(value)) {
      const endsWithNL = value[value.length - 1] == "\n";
      const op = endsWithNL ? "|" : "|-";
      const nl = `\n${prefix}`;

      return `${op}${nl}${(endsWithNL ? value.substring(0, value.length - 1) : value)
        .split("\n")
        .join(nl)}`;
    }

    if (needEscaping.test(value) || needQuotes.test(value)) {
      return `"${value.replace(needEscaping, (match: string) => {
        if (escapeMap[match]) return escapeMap[match];
        const code = match.charCodeAt(0).toString(16);
        return `\\x${code.length < 2 ? "0" : ""}${code}`;
      })}"`;
    }

    return value;
  }

  if (isArray(value)) {
    return joinLines(
      value.map((val: any) => `- ${serialize(val, `${prefix}  `, false, false)}`),
      prefix,
      hasInitialPrefix,
      hasLastNewLine
    );
  }

  if (isPlainObject(value)) {
    return joinLines(
      Object.entries(value).map(([key, val]) => {
        const isComplex = isArray(val) || isPlainObject(val);
        const spBeforeVal = isComplex ? "\n" : " ";

        return `${key}:${spBeforeVal}${serialize(val, `${prefix}  `, isComplex, false)}`;
      }),
      prefix,
      hasInitialPrefix,
      hasLastNewLine
    );
  }

  throw new Error("Cannot serialize this object to YAML, unknown type.");
};

const toYaml = (value: any): string => serialize(value);
export default toYaml;
