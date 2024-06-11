import { assertStrictEquals, assertThrows } from "./deps.ts";
import { Block, GeneralCategory, Rune } from "../mod.ts";

Deno.test("Rune.prototype.charCount", () => {
  assertStrictEquals(Rune.fromCodePoint(0).charCount, 1);
  assertStrictEquals(Rune.fromCodePoint(0xFFFF).charCount, 1);
  assertStrictEquals(Rune.fromCodePoint(0x10000).charCount, 2);
  assertStrictEquals(Rune.fromCodePoint(0x10FFFF).charCount, 2);
});

Deno.test("Rune.prototype.plane", () => {
  assertStrictEquals(Rune.fromCodePoint(0).plane, 0);
  assertStrictEquals(Rune.fromCodePoint(0xFFFF).plane, 0);
  assertStrictEquals(Rune.fromCodePoint(0x10000).plane, 1);
  assertStrictEquals(Rune.fromCodePoint(0x1FFFF).plane, 1);
  assertStrictEquals(Rune.fromCodePoint(0x20000).plane, 2);
  assertStrictEquals(Rune.fromCodePoint(0x2FFFF).plane, 2);
  assertStrictEquals(Rune.fromCodePoint(0x30000).plane, 3);
  assertStrictEquals(Rune.fromCodePoint(0x3FFFF).plane, 3);
  assertStrictEquals(Rune.fromCodePoint(0x40000).plane, 4);
  assertStrictEquals(Rune.fromCodePoint(0x4FFFF).plane, 4);
  assertStrictEquals(Rune.fromCodePoint(0x50000).plane, 5);
  assertStrictEquals(Rune.fromCodePoint(0x5FFFF).plane, 5);
  assertStrictEquals(Rune.fromCodePoint(0x60000).plane, 6);
  assertStrictEquals(Rune.fromCodePoint(0x6FFFF).plane, 6);
  assertStrictEquals(Rune.fromCodePoint(0x70000).plane, 7);
  assertStrictEquals(Rune.fromCodePoint(0x7FFFF).plane, 7);
  assertStrictEquals(Rune.fromCodePoint(0x80000).plane, 8);
  assertStrictEquals(Rune.fromCodePoint(0x8FFFF).plane, 8);
  assertStrictEquals(Rune.fromCodePoint(0x90000).plane, 9);
  assertStrictEquals(Rune.fromCodePoint(0x9FFFF).plane, 9);
  assertStrictEquals(Rune.fromCodePoint(0xA0000).plane, 10);
  assertStrictEquals(Rune.fromCodePoint(0xAFFFF).plane, 10);
  assertStrictEquals(Rune.fromCodePoint(0xB0000).plane, 11);
  assertStrictEquals(Rune.fromCodePoint(0xBFFFF).plane, 11);
  assertStrictEquals(Rune.fromCodePoint(0xC0000).plane, 12);
  assertStrictEquals(Rune.fromCodePoint(0xCFFFF).plane, 12);
  assertStrictEquals(Rune.fromCodePoint(0xD0000).plane, 13);
  assertStrictEquals(Rune.fromCodePoint(0xDFFFF).plane, 13);
  assertStrictEquals(Rune.fromCodePoint(0xE0000).plane, 14);
  assertStrictEquals(Rune.fromCodePoint(0xEFFFF).plane, 14);
  assertStrictEquals(Rune.fromCodePoint(0xF0000).plane, 15);
  assertStrictEquals(Rune.fromCodePoint(0xFFFFF).plane, 15);
  assertStrictEquals(Rune.fromCodePoint(0x100000).plane, 16);
  assertStrictEquals(Rune.fromCodePoint(0x10FFFF).plane, 16);
});

Deno.test("Rune.fromCodePoint(number), Rune.prototype.toCodePoint()", () => {
  assertStrictEquals(Rune.fromCodePoint(0).toCodePoint(), 0);
  assertStrictEquals(Rune.fromCodePoint(0x10FFFF).toCodePoint(), 0x10FFFF);
  assertStrictEquals(Rune.fromCodePoint(0xD7FF).toCodePoint(), 0xD7FF);
  assertStrictEquals(Rune.fromCodePoint(0xE000).toCodePoint(), 0xE000);

  assertThrows(
    () => {
      Rune.fromCodePoint(-1);
    },
    TypeError,
    "codePoint",
  );

  assertThrows(
    () => {
      Rune.fromCodePoint(0x110000);
    },
    TypeError,
    "codePoint",
  );

  assertThrows(
    () => {
      Rune.fromCodePoint(0xD800);
    },
    RangeError,
    "codePoint",
  );

  assertThrows(
    () => {
      Rune.fromCodePoint(0xDFFF);
    },
    RangeError,
    "codePoint",
  );
});

Deno.test("Rune.fromString(number)", () => {
  assertStrictEquals(Rune.fromString("\u{0}").toCodePoint(), 0);
  assertStrictEquals(Rune.fromString("\u{10FFFF}").toCodePoint(), 0x10FFFF);
  assertStrictEquals(Rune.fromString("\u{D7FF}").toCodePoint(), 0xD7FF);
  assertStrictEquals(Rune.fromString("\u{E000}").toCodePoint(), 0xE000);

  assertThrows(
    () => {
      Rune.fromString("");
    },
    TypeError,
    "runeString",
  );

  assertThrows(
    () => {
      Rune.fromString("00");
    },
    TypeError,
    "runeString",
  );

  assertThrows(
    () => {
      Rune.fromString("\uD800");
    },
    TypeError,
    "runeString",
  );

  assertThrows(
    () => {
      Rune.fromString("\uDFFF");
    },
    TypeError,
    "runeString",
  );
});

Deno.test("Rune.fromCharCodes(number[])", () => {
  assertStrictEquals(Rune.fromCharCodes([0]).toString(), "\u{0}");
  assertStrictEquals(Rune.fromCharCodes([0xFFFF]).toString(), "\u{FFFF}");
  assertStrictEquals(Rune.fromCharCodes([0xD7FF]).toString(), "\u{D7FF}");
  assertStrictEquals(Rune.fromCharCodes([0xE000]).toString(), "\u{E000}");

  assertStrictEquals(
    Rune.fromCharCodes([0xD800, 0xDC00]).toString(),
    "\uD800\uDC00",
  );

  assertThrows(
    () => {
      Rune.fromCharCodes([0xD800]);
    },
    RangeError,
    "charCodes",
  );
  assertThrows(
    () => {
      Rune.fromCharCodes([0xDBFF]);
    },
    RangeError,
    "charCodes",
  );
  assertThrows(
    () => {
      Rune.fromCharCodes([0xDC00]);
    },
    RangeError,
    "charCodes",
  );
  assertThrows(
    () => {
      Rune.fromCharCodes([0xDFFF]);
    },
    RangeError,
    "charCodes",
  );

  assertThrows(
    () => {
      Rune.fromCharCodes([]);
    },
    TypeError,
    "charCodes",
  );
  assertThrows(
    () => {
      Rune.fromCharCodes([0, 0, 0]);
    },
    TypeError,
    "charCodes",
  );
  assertThrows(
    () => {
      Rune.fromCharCodes([0, -1]);
    },
    TypeError,
    "charCodes[1]",
  );
  assertThrows(
    () => {
      Rune.fromCharCodes([0x10000, 1]);
    },
    TypeError,
    "charCodes[0]",
  );
});

Deno.test("Rune.prototype.toString()", () => {
  assertStrictEquals(Rune.fromCodePoint(0).toString(), "\u{0}");
  assertStrictEquals(Rune.fromCodePoint(0x10FFFF).toString(), "\u{10FFFF}");
  assertStrictEquals(Rune.fromCodePoint(0xD7FF).toString(), "\u{D7FF}");
  assertStrictEquals(Rune.fromCodePoint(0xE000).toString(), "\u{E000}");
});

Deno.test("Rune.prototype.toCharCodes(string)", () => {
  assertStrictEquals(Rune.fromCodePoint(0).toCharCodes().join(","), "0");
  assertStrictEquals(
    Rune.fromCodePoint(0xFFFF).toCharCodes().join(","),
    "65535",
  );
  assertStrictEquals(
    Rune.fromCodePoint(0xD7FF).toCharCodes().join(","),
    "55295",
  );
  assertStrictEquals(
    Rune.fromCodePoint(0xE000).toCharCodes().join(","),
    "57344",
  );

  assertStrictEquals(
    Rune.fromCodePoint(0x10000).toCharCodes().join(","),
    "55296,56320",
  );
});

Deno.test("Rune.prototype.isBmp()", () => {
  assertStrictEquals(Rune.fromCodePoint(0).isBmp(), true);
  assertStrictEquals(Rune.fromCodePoint(0xFFFF).isBmp(), true);
  assertStrictEquals(Rune.fromCodePoint(0x10000).isBmp(), false);
  assertStrictEquals(Rune.fromCodePoint(0x10FFFF).isBmp(), false);
});

Deno.test("Rune.prototype.inPlanes(number[])", () => {
  assertStrictEquals(Rune.fromCodePoint(0).inPlanes([]), false);

  assertStrictEquals(Rune.fromCodePoint(0).inPlanes([0]), true);
  assertStrictEquals(Rune.fromCodePoint(0xFFFF).inPlanes([0]), true);
  assertStrictEquals(Rune.fromCodePoint(0).inPlanes([1]), false);
  assertStrictEquals(Rune.fromCodePoint(0x100000).inPlanes([16]), true);
  assertStrictEquals(Rune.fromCodePoint(0x10FFFF).inPlanes([16]), true);

  assertStrictEquals(Rune.fromCodePoint(0).inPlanes([0, 16]), true);
  assertStrictEquals(Rune.fromCodePoint(0xFFFF).inPlanes([0, 16]), true);
  assertStrictEquals(Rune.fromCodePoint(0).inPlanes([1, 16]), false);
  assertStrictEquals(Rune.fromCodePoint(0x100000).inPlanes([0, 16]), true);
  assertStrictEquals(Rune.fromCodePoint(0x10FFFF).inPlanes([0, 16]), true);

  assertThrows(
    () => {
      Rune.fromCodePoint(0).inPlanes(undefined as unknown as []);
    },
    TypeError,
    "planes",
  );

  assertThrows(
    () => {
      Rune.fromCodePoint(0).inPlanes("0" as unknown as []);
    },
    TypeError,
    "planes",
  );

  assertThrows(
    () => {
      Rune.fromCodePoint(0).inPlanes([-1] as unknown as []);
    },
    TypeError,
    "planes[*]",
  );

  assertThrows(
    () => {
      Rune.fromCodePoint(0).inPlanes([17] as unknown as []);
    },
    TypeError,
    "planes[*]",
  );
});

Deno.test("Rune.prototype.inCodePointRanges(number[])", () => {
  const blocks0: Array<[number] | [number, number]> = [];

  assertStrictEquals(Rune.fromCodePoint(0).inCodePointRanges(blocks0), false);
  assertStrictEquals(
    Rune.fromCodePoint(0x7F).inCodePointRanges(blocks0),
    false,
  );
  assertStrictEquals(
    Rune.fromCodePoint(0x80).inCodePointRanges(blocks0),
    false,
  );
  assertStrictEquals(
    Rune.fromCodePoint(0xFF).inCodePointRanges(blocks0),
    false,
  );
  assertStrictEquals(
    Rune.fromCodePoint(0x100).inCodePointRanges(blocks0),
    false,
  );

  const blocks1 = [
    Block.C0_CONTROLS_AND_BASIC_LATIN,
    Block.C1_CONTROLS_AND_LATIN_1_SUPPLEMENT,
  ];

  assertStrictEquals(Rune.fromCodePoint(0).inCodePointRanges(blocks1), true);
  assertStrictEquals(Rune.fromCodePoint(0x7F).inCodePointRanges(blocks1), true);
  assertStrictEquals(Rune.fromCodePoint(0x80).inCodePointRanges(blocks1), true);
  assertStrictEquals(Rune.fromCodePoint(0xFF).inCodePointRanges(blocks1), true);
  assertStrictEquals(
    Rune.fromCodePoint(0x100).inCodePointRanges(blocks1),
    false,
  );

  const blocks2 = [
    Block.C1_CONTROLS_AND_LATIN_1_SUPPLEMENT,
    Block.C0_CONTROLS_AND_BASIC_LATIN,
  ];

  assertStrictEquals(Rune.fromCodePoint(0).inCodePointRanges(blocks2), true);
  assertStrictEquals(Rune.fromCodePoint(0x7F).inCodePointRanges(blocks2), true);
  assertStrictEquals(Rune.fromCodePoint(0x80).inCodePointRanges(blocks2), true);
  assertStrictEquals(Rune.fromCodePoint(0xFF).inCodePointRanges(blocks2), true);
  assertStrictEquals(
    Rune.fromCodePoint(0x100).inCodePointRanges(blocks2),
    false,
  );

  assertThrows(
    () => {
      Rune.fromCodePoint(0).inCodePointRanges(undefined as unknown as []);
    },
    TypeError,
    "ranges",
  );

  assertThrows(
    () => {
      Rune.fromCodePoint(0).inCodePointRanges(0 as unknown as []);
    },
    TypeError,
    "ranges",
  );

  assertThrows(
    () => {
      Rune.fromCodePoint(0).inCodePointRanges([0 as unknown as [0]]);
    },
    TypeError,
    "ranges[*]",
  );

  assertThrows(
    () => {
      Rune.fromCodePoint(0).inCodePointRanges([
        Block.C0_CONTROLS_AND_BASIC_LATIN,
        0 as unknown as [0],
      ]);
    },
    TypeError,
    "ranges[*]",
  );

  assertThrows(
    () => {
      Rune.fromCodePoint(0).inCodePointRanges([
        0 as unknown as [0],
        Block.C0_CONTROLS_AND_BASIC_LATIN,
      ]);
    },
    TypeError,
    "ranges[*]",
  );
});

Deno.test("Rune.prototype.isVariationSelector()", () => {
  assertStrictEquals(Rune.fromCodePoint(0xFDFF).isVariationSelector(), false);
  assertStrictEquals(Rune.fromCodePoint(0xFE00).isVariationSelector(), true);
  assertStrictEquals(Rune.fromCodePoint(0xFE0F).isVariationSelector(), true);
  assertStrictEquals(Rune.fromCodePoint(0xFE10).isVariationSelector(), false);
  assertStrictEquals(Rune.fromCodePoint(0xE00FF).isVariationSelector(), false);
  assertStrictEquals(Rune.fromCodePoint(0xE0100).isVariationSelector(), true);
  assertStrictEquals(Rune.fromCodePoint(0xE01EF).isVariationSelector(), true);
  assertStrictEquals(Rune.fromCodePoint(0xE01F0).isVariationSelector(), false);
  assertStrictEquals(Rune.fromCodePoint(0x180A).isVariationSelector(), false);
  assertStrictEquals(Rune.fromCodePoint(0x180B).isVariationSelector(), true);
  assertStrictEquals(Rune.fromCodePoint(0x180F).isVariationSelector(), true);
  assertStrictEquals(Rune.fromCodePoint(0x1810).isVariationSelector(), false);
});

Deno.test("Rune.prototype.matchesScripts(string[], boolean?)", () => {
  const hiraA = Rune.fromString("あ");
  const kanaA = Rune.fromString("ア");
  const ch = Rune.fromString("ー");
  const d1 = Rune.fromString("1");

  const scripts0 = ["Hira"];

  assertStrictEquals(hiraA.matchesScripts(scripts0), true);
  assertStrictEquals(hiraA.matchesScripts(scripts0, false), true);
  assertStrictEquals(hiraA.matchesScripts(scripts0, true), true);
  assertStrictEquals(kanaA.matchesScripts(scripts0), false);
  assertStrictEquals(kanaA.matchesScripts(scripts0, false), false);
  assertStrictEquals(kanaA.matchesScripts(scripts0, true), false);
  assertStrictEquals(ch.matchesScripts(scripts0), true);
  assertStrictEquals(ch.matchesScripts(scripts0, false), true);
  assertStrictEquals(ch.matchesScripts(scripts0, true), false);
  assertStrictEquals(d1.matchesScripts(scripts0), false);
  assertStrictEquals(d1.matchesScripts(scripts0, false), false);
  assertStrictEquals(d1.matchesScripts(scripts0, true), false);

  const scripts1 = ["Hira", "Kana"];

  assertStrictEquals(hiraA.matchesScripts(scripts1), true);
  assertStrictEquals(hiraA.matchesScripts(scripts1, false), true);
  assertStrictEquals(hiraA.matchesScripts(scripts1, true), true);
  assertStrictEquals(kanaA.matchesScripts(scripts1), true);
  assertStrictEquals(kanaA.matchesScripts(scripts1, false), true);
  assertStrictEquals(kanaA.matchesScripts(scripts1, true), true);
  assertStrictEquals(ch.matchesScripts(scripts1), true);
  assertStrictEquals(ch.matchesScripts(scripts1, false), true);
  assertStrictEquals(ch.matchesScripts(scripts1, true), false);
  assertStrictEquals(d1.matchesScripts(scripts1), false);
  assertStrictEquals(d1.matchesScripts(scripts1, false), false);
  assertStrictEquals(d1.matchesScripts(scripts1, true), false);

  const scripts2: string[] = [];

  assertStrictEquals(hiraA.matchesScripts(scripts2), false);
  assertStrictEquals(hiraA.matchesScripts(scripts2, false), false);
  assertStrictEquals(hiraA.matchesScripts(scripts2, true), false);
  assertStrictEquals(kanaA.matchesScripts(scripts2), false);
  assertStrictEquals(kanaA.matchesScripts(scripts2, false), false);
  assertStrictEquals(kanaA.matchesScripts(scripts2, true), false);
  assertStrictEquals(ch.matchesScripts(scripts2), false);
  assertStrictEquals(ch.matchesScripts(scripts2, false), false);
  assertStrictEquals(ch.matchesScripts(scripts2, true), false);
  assertStrictEquals(d1.matchesScripts(scripts2), false);
  assertStrictEquals(d1.matchesScripts(scripts2, false), false);
  assertStrictEquals(d1.matchesScripts(scripts2, true), false);

  assertThrows(
    () => {
      d1.matchesScripts(null as unknown as []);
    },
    TypeError,
    "scripts",
  );

  assertThrows(
    () => {
      d1.matchesScripts(["HIRA"]);
    },
    TypeError,
    "scripts[*]",
  );
  assertThrows(
    () => {
      d1.matchesScripts(["hira"]);
    },
    TypeError,
    "scripts[*]",
  );
  assertThrows(
    () => {
      d1.matchesScripts(["Latn", "HIRA"]);
    },
    TypeError,
    "scripts[*]",
  );
  assertThrows(
    () => {
      d1.matchesScripts(["HIRA", "Latn"]);
    },
    TypeError,
    "scripts[*]",
  );
});

Deno.test("Rune.prototype.matchesGeneralCategories(string[])", () => {
  const latnA = Rune.fromString("A");
  const d1 = Rune.fromString("1");
  const hiraA = Rune.fromString("あ");
  const fs = Rune.fromString(".");

  const cats0: Array<GeneralCategory> = [];

  assertStrictEquals(latnA.matchesGeneralCategories(cats0), false);
  assertStrictEquals(d1.matchesGeneralCategories(cats0), false);
  assertStrictEquals(hiraA.matchesGeneralCategories(cats0), false);
  assertStrictEquals(fs.matchesGeneralCategories(cats0), false);

  const cats1 = [GeneralCategory.LETTER];

  assertStrictEquals(latnA.matchesGeneralCategories(cats1), true);
  assertStrictEquals(d1.matchesGeneralCategories(cats1), false);
  assertStrictEquals(hiraA.matchesGeneralCategories(cats1), true);
  assertStrictEquals(fs.matchesGeneralCategories(cats1), false);

  const cats2 = [GeneralCategory.NUMBER];

  assertStrictEquals(latnA.matchesGeneralCategories(cats2), false);
  assertStrictEquals(d1.matchesGeneralCategories(cats2), true);
  assertStrictEquals(hiraA.matchesGeneralCategories(cats2), false);
  assertStrictEquals(fs.matchesGeneralCategories(cats2), false);

  const cats3 = [GeneralCategory.LETTER, GeneralCategory.NUMBER];

  assertStrictEquals(latnA.matchesGeneralCategories(cats3), true);
  assertStrictEquals(d1.matchesGeneralCategories(cats3), true);
  assertStrictEquals(hiraA.matchesGeneralCategories(cats3), true);
  assertStrictEquals(fs.matchesGeneralCategories(cats3), false);

  assertThrows(
    () => {
      d1.matchesGeneralCategories(
        0 as unknown as GeneralCategory[],
      );
    },
    TypeError,
    "generalCategories",
  );

  assertThrows(
    () => {
      d1.matchesGeneralCategories(
        ["l"] as unknown as GeneralCategory[],
      );
    },
    TypeError,
    "generalCategories[*]",
  );
  assertThrows(
    () => {
      d1.matchesGeneralCategories(
        ["L", "l"] as unknown as GeneralCategory[],
      );
    },
    TypeError,
    "generalCategories[*]",
  );
  assertThrows(
    () => {
      d1.matchesGeneralCategories(
        ["l", "L"] as unknown as GeneralCategory[],
      );
    },
    TypeError,
    "generalCategories[*]",
  );
});

Deno.test("Rune.prototype.clone()", () => {
  assertStrictEquals(Rune.fromCodePoint(0).clone().toCodePoint(), 0);
  assertStrictEquals(
    Rune.fromCodePoint(0x10FFFF).clone().toCodePoint(),
    0x10FFFF,
  );
  assertStrictEquals(Rune.fromCodePoint(0xD7FF).clone().toCodePoint(), 0xD7FF);
  assertStrictEquals(Rune.fromCodePoint(0xE000).clone().toCodePoint(), 0xE000);
});
