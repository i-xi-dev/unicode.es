import { Block } from "./block.ts";
import { CodePointRange } from "./code_point_range.ts";
import { NumberEx } from "../deps.ts";
import { Plane } from "./plane.ts";

// 事実上定義できないのでnumberの別名とする
export type CodePoint = number;

const _BMP = 0;

const _SURROGATES = [Block.HIGH_SURROGATE_AREA, Block.LOW_SURROGATE_AREA];
const _VSS = [
  Block.VARIATION_SELECTORS,
  Block.VARIATION_SELECTORS_SUPPLEMENT,
  [0x180B, 0x180F],
] as CodePointRange[];
//XXX c0,c1,

function _isPlane(test: unknown): test is Plane {
  return Number.isSafeInteger(test) &&
    NumberEx.inRange(test as number, [0, 16]);
}

function _inRange(
  codePoint: CodePoint,
  range: CodePointRange,
  checked: boolean,
) {
  if (checked !== true) {
    if (CodePoint.isCodePoint(codePoint) !== true) {
      throw new TypeError("codePoint");
    }
  }
  return NumberEx.inRange(codePoint, range);
}

export namespace CodePoint {
  export const MIN_VALUE = 0x0;

  export const MAX_VALUE = 0x10FFFF;

  export function isCodePoint(test: unknown): test is CodePoint {
    return Number.isSafeInteger(test) &&
      NumberEx.inRange(test as number, [MIN_VALUE, MAX_VALUE]);
  }

  export function toString(codePoint: CodePoint): string {
    if (isCodePoint(codePoint) !== true) {
      throw new TypeError("codePoint");
    }
    return `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`;
  }

  export function planeOf(codePoint: CodePoint, _checked = false): Plane {
    if (_checked !== true) {
      if (isCodePoint(codePoint) !== true) {
        throw new TypeError("codePoint");
      }
    }
    return Math.trunc(codePoint / 0x10000) as Plane;
  }

  export function isBmp(codePoint: CodePoint, _checked = false): boolean {
    if (_checked !== true) {
      if (isCodePoint(codePoint) !== true) {
        throw new TypeError("codePoint");
      }
    }
    return (planeOf(codePoint, true) === _BMP);
  }

  export function inPlanes(
    codePoint: CodePoint,
    planes: Array<Plane>,
    _checked = false,
  ): boolean {
    if (_checked !== true) {
      if (isCodePoint(codePoint) !== true) {
        throw new TypeError("codePoint");
      }
    }

    if (Array.isArray(planes)) {
      if (planes.every((plane) => _isPlane(plane)) !== true) {
        throw new TypeError("planes[*]");
      }
      return planes.includes(CodePoint.planeOf(codePoint, true));
    } else {
      throw new TypeError("planes");
    }
  }

  export function isHighSurrogate(
    codePoint: CodePoint,
    _checked = false,
  ): boolean {
    return _inRange(codePoint, Block.HIGH_SURROGATE_AREA, _checked);
  }

  export function isLowSurrogate(
    codePoint: CodePoint,
    _checked = false,
  ): boolean {
    return _inRange(codePoint, Block.LOW_SURROGATE_AREA, _checked);
  }

  export function inRanges(
    codePoint: CodePoint,
    ranges: Array<CodePointRange>,
    _checked = false,
  ): boolean {
    if (_checked !== true) {
      if (isCodePoint(codePoint) !== true) {
        throw new TypeError("codePoint");
      }
    }

    if (Array.isArray(ranges)) {
      if (
        ranges.every((range) =>
          Array.isArray(range) && (range.length >= 1) && (range.length <= 2)
        ) !== true
      ) {
        throw new TypeError("ranges[*]");
      }
      return ranges.some((range) => NumberEx.inRange(codePoint, range));
    } else {
      throw new TypeError("ranges");
    }
  }

  export function isSurrogate(codePoint: CodePoint, _checked = false): boolean {
    return inRanges(codePoint, _SURROGATES, _checked);
  }

  export function isVariationSelector(
    codePoint: CodePoint,
    _checked = false,
  ): boolean {
    return inRanges(codePoint, _VSS, _checked);
  }
}
