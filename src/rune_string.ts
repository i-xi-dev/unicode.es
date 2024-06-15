import { CodePoint } from "./code_point.ts";
import { CodePointRange } from "./code_point_range.ts";
import { GeneralCategory } from "./general_category.ts";
import { Plane } from "./plane.ts";
import { StringEx, Uint16 } from "../deps.ts";

// scriptは、UnicodeのScript（≒ISO 15924のScript、Intl.Localeのscript）
function _isScript(test: unknown): boolean {
  return StringEx.isString(test) && /^[A-Z][a-z]{3}$/.test(test);
}

function _matchesScripts(
  runeString: RuneString,
  scripts: Array<string>,
  excludeScriptExtensions: boolean,
): boolean {
  let ps: Array<string>;
  if (excludeScriptExtensions === true) {
    ps = scripts.map((script) => `\\p{sc=${script}}`);
  } else {
    ps = scripts.map((script) => `\\p{scx=${script}}`);
  }
  return (new RegExp(`^[${ps.join("|")}]$`, "u")).test(runeString);
}

function _matchesGeneralCategories(
  runeString: RuneString,
  generalCategories: Array<GeneralCategory>,
  exclude: boolean,
): boolean {
  const ps = generalCategories.map((category) => `\\p{gc=${category}}`);
  return (new RegExp(
    `^[${exclude ? "^" : StringEx.EMPTY}${ps.join("|")}]$`,
    "u",
  )).test(
    runeString,
  );
}

// 事実上定義できないのでstringの別名とする
export type RuneString = string;

export namespace RuneString {
  export function isRuneString(test: unknown): test is RuneString {
    if (StringEx.isString(test) !== true) {
      return false;
    }

    if (test.length > 2) {
      return false;
    }

    //XXX 以降は、将来的には右記で良い const t = [...test];t.length===1&&t[0].isWellFormed()
    const runeStringSequence = [...test];
    if (runeStringSequence.length !== 1) {
      return false;
    }
    if (
      (test.length === 1) &&
      CodePoint.isSurrogate(
        runeStringSequence[0].codePointAt(0) as CodePoint,
        true,
      )
    ) {
      return false;
    }
    return true;
  }

  export function fromCodePoint(
    codePoint: CodePoint,
    _checked = false,
  ): RuneString {
    if (_checked !== true) {
      if (CodePoint.isCodePoint(codePoint) !== true) {
        throw new TypeError("codePoint");
      }
    }

    if (CodePoint.isSurrogate(codePoint, true)) {
      throw new RangeError("codePoint");
    }

    return String.fromCodePoint(codePoint);
  }

  export function toCodePoint(
    runeString: RuneString,
    _checked = false,
  ): CodePoint {
    if (_checked !== true) {
      if (isRuneString(runeString) !== true) {
        throw new TypeError("runeString");
      }
    }
    return runeString.codePointAt(0) as CodePoint;
  }

  export function fromCharCodes(charCodes: Iterable<number>): RuneString {
    const temp = [];
    let count = 0;
    for (const charCode of charCodes) {
      if (count >= 2) {
        throw new TypeError("charCodes");
      }

      if (Uint16.isUint16(charCode) !== true) {
        throw new TypeError(`charCodes[${count}]`);
      }

      temp.push(charCode);
      count++;
    }

    if (temp.length <= 0) {
      throw new TypeError("charCodes");
    }

    const charCode0 = temp[0];
    if (
      (temp.length === 1) && (CodePoint.isSurrogate(charCode0, true) !== true)
    ) { // ここではcharCodeはcodePointに等しい
      return String.fromCharCode(charCode0);
    }
    const charCode1 = temp[1];
    if (
      (temp.length === 2) && CodePoint.isHighSurrogate(charCode0, true) &&
      CodePoint.isLowSurrogate(charCode1, true)
    ) {
      return String.fromCharCode(charCode0) + String.fromCharCode(charCode1);
    }

    throw new RangeError("charCodes");
  }

  export function toCharCodes(
    runeString: RuneString,
    _checked = false,
  ): [Uint16] | [Uint16, Uint16] {
    if (_checked !== true) {
      if (RuneString.isRuneString(runeString) !== true) {
        throw new TypeError("runeString");
      }
    }

    const charCode0 = runeString.charCodeAt(0);
    if (runeString.length === 1) {
      return [charCode0];
    } else {
      return [charCode0, runeString.charCodeAt(1)];
    }
  }

  //TODO fromUtf8Bytes(bytes: Iterable<number>): RuneString

  //TODO toUtf8Bytes(runeString: RuneString, _checked = false): [Uint8] | [Uint8, Uint8] | [Uint8, Uint8, Uint8] | [Uint8, Uint8, Uint8, Uint8]

  export function planeOf(runeString: RuneString, _checked = false): Plane {
    if (_checked !== true) {
      if (RuneString.isRuneString(runeString) !== true) {
        throw new TypeError("runeString");
      }
    }
    return CodePoint.planeOf(RuneString.toCodePoint(runeString, true), true);
  }

  export function isBmp(runeString: RuneString, _checked = false): boolean {
    if (_checked !== true) {
      if (RuneString.isRuneString(runeString) !== true) {
        throw new TypeError("runeString");
      }
    }
    return CodePoint.isBmp(RuneString.toCodePoint(runeString, true), true);
  }

  export function inPlanes(
    runeString: RuneString,
    planes: Array<Plane>,
    _checked = false,
  ): boolean {
    if (_checked !== true) {
      if (RuneString.isRuneString(runeString) !== true) {
        throw new TypeError("runeString");
      }
    }
    return CodePoint.inPlanes(
      RuneString.toCodePoint(runeString, true),
      planes,
      true,
    );
  }

  export function inCodePointRanges(
    runeString: RuneString,
    ranges: Array<CodePointRange>,
    _checked = false,
  ): boolean {
    if (_checked !== true) {
      if (RuneString.isRuneString(runeString) !== true) {
        throw new TypeError("runeString");
      }
    }
    return CodePoint.inRanges(
      RuneString.toCodePoint(runeString, true),
      ranges,
      true,
    );
  }

  export function isVariationSelector(
    runeString: RuneString,
    _checked = false,
  ): boolean {
    if (_checked !== true) {
      if (RuneString.isRuneString(runeString) !== true) {
        throw new TypeError("runeString");
      }
    }
    return CodePoint.isVariationSelector(
      RuneString.toCodePoint(runeString, true),
    );
  }

  export function matchesScripts(
    runeString: RuneString,
    scripts: Array<string>,
    excludeScriptExtensions = false,
    _checked = false,
  ): boolean {
    if (_checked !== true) {
      if (RuneString.isRuneString(runeString) !== true) {
        throw new TypeError("runeString");
      }
    }

    if (Array.isArray(scripts)) {
      if (scripts.every((script) => _isScript(script)) !== true) {
        throw new TypeError("scripts[*]");
      }
      return _matchesScripts(
        runeString,
        scripts,
        excludeScriptExtensions,
      );
    } else {
      throw new TypeError("scripts");
    }
  }

  export function matchesGeneralCategories(
    runeString: RuneString,
    generalCategories: Array<GeneralCategory>,
    _checked = false,
  ): boolean {
    if (_checked !== true) {
      if (RuneString.isRuneString(runeString) !== true) {
        throw new TypeError("runeString");
      }
    }

    if (Array.isArray(generalCategories)) {
      if (
        generalCategories.every((category) =>
          Object.values(GeneralCategory).includes(category)
        ) !== true
      ) {
        throw new TypeError("generalCategories[*]");
      }
      return _matchesGeneralCategories(runeString, generalCategories, false);
    } else {
      throw new TypeError("generalCategories");
    }
  }
}
