import { assertStrictEquals, assertThrows } from "./deps.ts";
import { Block, GeneralCategory, RuneString } from "../mod.ts";

Deno.test("RuneString.isRuneString(any)", () => {
  assertStrictEquals(RuneString.isRuneString(""), false);
  assertStrictEquals(RuneString.isRuneString("1"), true);
  assertStrictEquals(RuneString.isRuneString("11"), false);
  assertStrictEquals(RuneString.isRuneString("111"), false);

  assertStrictEquals(RuneString.isRuneString("\u{0}"), true);
  assertStrictEquals(RuneString.isRuneString("\u{10FFFF}"), true);
  assertStrictEquals(RuneString.isRuneString("\u{D7FF}"), true);
  assertStrictEquals(RuneString.isRuneString("\u{D800}"), false);
  assertStrictEquals(RuneString.isRuneString("\u{DBFF}"), false);
  assertStrictEquals(RuneString.isRuneString("\u{DC00}"), false);
  assertStrictEquals(RuneString.isRuneString("\u{DFFF}"), false);
  assertStrictEquals(RuneString.isRuneString("\u{E000}"), true);

  assertStrictEquals(RuneString.isRuneString("\u{10000}"), true);
  assertStrictEquals(RuneString.isRuneString("\u{10000}\u{D800}"), false);
  assertStrictEquals(RuneString.isRuneString("\u{DC00}\u{D800}"), false);
  assertStrictEquals(RuneString.isRuneString("\uD7FF\uDC00"), false);
  assertStrictEquals(RuneString.isRuneString("\u{D800}\u{DC00}"), true);
  assertStrictEquals(RuneString.isRuneString("🤷🏽‍♀️"), false);

  assertStrictEquals(RuneString.isRuneString(undefined), false);
  assertStrictEquals(RuneString.isRuneString(1), false);
});

Deno.test("RuneString.fromCodePoint(any)", () => {
  assertStrictEquals(RuneString.fromCodePoint(0x0), "\u{0}");
  assertStrictEquals(RuneString.fromCodePoint(0x10FFFF), "\u{10FFFF}");
  assertStrictEquals(RuneString.fromCodePoint(0xD7FF), "\u{D7FF}");
  assertStrictEquals(RuneString.fromCodePoint(0xE000), "\u{E000}");

  assertThrows(
    () => {
      RuneString.fromCodePoint("" as unknown as number);
    },
    TypeError,
    "codePoint",
  );

  assertThrows(
    () => {
      RuneString.fromCodePoint(-1);
    },
    TypeError,
    "codePoint",
  );

  assertThrows(
    () => {
      RuneString.fromCodePoint(0x110000);
    },
    TypeError,
    "codePoint",
  );

  assertThrows(
    () => {
      RuneString.fromCodePoint(0xD800);
    },
    RangeError,
    "codePoint",
  );

  assertThrows(
    () => {
      RuneString.fromCodePoint(0xDFFF);
    },
    RangeError,
    "codePoint",
  );
});

Deno.test("RuneString.toCodePoint(string)", () => {
  assertStrictEquals(RuneString.toCodePoint("\u{0}"), 0x0);
  assertStrictEquals(RuneString.toCodePoint("\u{10FFFF}"), 0x10FFFF);
  assertStrictEquals(RuneString.toCodePoint("\u{D7FF}"), 0xD7FF);
  assertStrictEquals(RuneString.toCodePoint("\u{E000}"), 0xE000);

  assertThrows(
    () => {
      RuneString.toCodePoint("\u{D800}");
    },
    TypeError,
    "runeString",
  );
  assertThrows(
    () => {
      RuneString.toCodePoint("\u{DBFF}");
    },
    TypeError,
    "runeString",
  );
  assertThrows(
    () => {
      RuneString.toCodePoint("\u{DC00}");
    },
    TypeError,
    "runeString",
  );
  assertThrows(
    () => {
      RuneString.toCodePoint("\u{DFFF}");
    },
    TypeError,
    "runeString",
  );

  assertThrows(
    () => {
      RuneString.toCodePoint("");
    },
    TypeError,
    "runeString",
  );

  assertThrows(
    () => {
      RuneString.toCodePoint("11");
    },
    TypeError,
    "runeString",
  );
});

Deno.test("RuneString.fromCharCodes(number[])", () => {
  assertStrictEquals(RuneString.fromCharCodes([0]), "\u{0}");
  assertStrictEquals(RuneString.fromCharCodes([0xFFFF]), "\u{FFFF}");
  assertStrictEquals(RuneString.fromCharCodes([0xD7FF]), "\u{D7FF}");
  assertStrictEquals(RuneString.fromCharCodes([0xE000]), "\u{E000}");

  assertStrictEquals(
    RuneString.fromCharCodes([0xD800, 0xDC00]),
    "\uD800\uDC00",
  );

  assertThrows(
    () => {
      RuneString.fromCharCodes([0xD800]);
    },
    RangeError,
    "charCodes",
  );
  assertThrows(
    () => {
      RuneString.fromCharCodes([0xDBFF]);
    },
    RangeError,
    "charCodes",
  );
  assertThrows(
    () => {
      RuneString.fromCharCodes([0xDC00]);
    },
    RangeError,
    "charCodes",
  );
  assertThrows(
    () => {
      RuneString.fromCharCodes([0xDFFF]);
    },
    RangeError,
    "charCodes",
  );

  assertThrows(
    () => {
      RuneString.fromCharCodes([]);
    },
    TypeError,
    "charCodes",
  );
  assertThrows(
    () => {
      RuneString.fromCharCodes([0, 0, 0]);
    },
    TypeError,
    "charCodes",
  );
  assertThrows(
    () => {
      RuneString.fromCharCodes([0, -1]);
    },
    TypeError,
    "charCodes[1]",
  );
  assertThrows(
    () => {
      RuneString.fromCharCodes([0x10000, 1]);
    },
    TypeError,
    "charCodes[0]",
  );
});

Deno.test("RuneString.toCharCodes(string)", () => {
  assertStrictEquals(RuneString.toCharCodes("\u{0}").join(","), "0");
  assertStrictEquals(RuneString.toCharCodes("\u{FFFF}").join(","), "65535");
  assertStrictEquals(RuneString.toCharCodes("\u{D7FF}").join(","), "55295");
  assertStrictEquals(RuneString.toCharCodes("\u{E000}").join(","), "57344");

  assertStrictEquals(
    RuneString.toCharCodes("\uD800\uDC00").join(","),
    "55296,56320",
  );

  assertThrows(
    () => {
      RuneString.toCharCodes("\uD800");
    },
    TypeError,
    "runeString",
  );
  assertThrows(
    () => {
      RuneString.toCharCodes("\uDBFF");
    },
    TypeError,
    "runeString",
  );
  assertThrows(
    () => {
      RuneString.toCharCodes("\uDC00");
    },
    TypeError,
    "runeString",
  );
  assertThrows(
    () => {
      RuneString.toCharCodes("\uDFFF");
    },
    TypeError,
    "runeString",
  );

  assertThrows(
    () => {
      RuneString.toCharCodes("");
    },
    TypeError,
    "runeString",
  );
  assertThrows(
    () => {
      RuneString.toCharCodes("00");
    },
    TypeError,
    "runeString",
  );
});

Deno.test("RuneString.planeOf(string)", () => {
  assertStrictEquals(RuneString.planeOf("\u{0}"), 0);
  assertStrictEquals(RuneString.planeOf("\u{FFFF}"), 0);
  assertStrictEquals(RuneString.planeOf("\u{10000}"), 1);
  assertStrictEquals(RuneString.planeOf("\u{1FFFF}"), 1);
  assertStrictEquals(RuneString.planeOf("\u{20000}"), 2);
  assertStrictEquals(RuneString.planeOf("\u{2FFFF}"), 2);
  assertStrictEquals(RuneString.planeOf("\u{30000}"), 3);
  assertStrictEquals(RuneString.planeOf("\u{3FFFF}"), 3);
  assertStrictEquals(RuneString.planeOf("\u{40000}"), 4);
  assertStrictEquals(RuneString.planeOf("\u{4FFFF}"), 4);
  assertStrictEquals(RuneString.planeOf("\u{50000}"), 5);
  assertStrictEquals(RuneString.planeOf("\u{5FFFF}"), 5);
  assertStrictEquals(RuneString.planeOf("\u{60000}"), 6);
  assertStrictEquals(RuneString.planeOf("\u{6FFFF}"), 6);
  assertStrictEquals(RuneString.planeOf("\u{70000}"), 7);
  assertStrictEquals(RuneString.planeOf("\u{7FFFF}"), 7);
  assertStrictEquals(RuneString.planeOf("\u{80000}"), 8);
  assertStrictEquals(RuneString.planeOf("\u{8FFFF}"), 8);
  assertStrictEquals(RuneString.planeOf("\u{90000}"), 9);
  assertStrictEquals(RuneString.planeOf("\u{9FFFF}"), 9);
  assertStrictEquals(RuneString.planeOf("\u{A0000}"), 10);
  assertStrictEquals(RuneString.planeOf("\u{AFFFF}"), 10);
  assertStrictEquals(RuneString.planeOf("\u{B0000}"), 11);
  assertStrictEquals(RuneString.planeOf("\u{BFFFF}"), 11);
  assertStrictEquals(RuneString.planeOf("\u{C0000}"), 12);
  assertStrictEquals(RuneString.planeOf("\u{CFFFF}"), 12);
  assertStrictEquals(RuneString.planeOf("\u{D0000}"), 13);
  assertStrictEquals(RuneString.planeOf("\u{DFFFF}"), 13);
  assertStrictEquals(RuneString.planeOf("\u{E0000}"), 14);
  assertStrictEquals(RuneString.planeOf("\u{EFFFF}"), 14);
  assertStrictEquals(RuneString.planeOf("\u{F0000}"), 15);
  assertStrictEquals(RuneString.planeOf("\u{FFFFF}"), 15);
  assertStrictEquals(RuneString.planeOf("\u{100000}"), 16);
  assertStrictEquals(RuneString.planeOf("\u{10FFFF}"), 16);

  assertThrows(
    () => {
      RuneString.planeOf("");
    },
    TypeError,
    "runeString",
  );

  assertThrows(
    () => {
      RuneString.planeOf("11");
    },
    TypeError,
    "runeString",
  );
});

Deno.test("RuneString.isBmp(string)", () => {
  assertStrictEquals(RuneString.isBmp("\u{0}"), true);
  assertStrictEquals(RuneString.isBmp("\u{FFFF}"), true);
  assertStrictEquals(RuneString.isBmp("\u{10000}"), false);
  assertStrictEquals(RuneString.isBmp("\u{10FFFF}"), false);

  assertThrows(
    () => {
      RuneString.isBmp("");
    },
    TypeError,
    "runeString",
  );

  assertThrows(
    () => {
      RuneString.isBmp("11");
    },
    TypeError,
    "runeString",
  );
});

Deno.test("RuneString.inPlanes(string, number[])", () => {
  assertStrictEquals(RuneString.inPlanes("\u{0}", []), false);

  assertStrictEquals(RuneString.inPlanes("\u{0}", [0]), true);
  assertStrictEquals(RuneString.inPlanes("\u{FFFF}", [0]), true);
  assertStrictEquals(RuneString.inPlanes("\u{0}", [1]), false);
  assertStrictEquals(RuneString.inPlanes("\u{100000}", [16]), true);
  assertStrictEquals(RuneString.inPlanes("\u{10FFFF}", [16]), true);

  assertStrictEquals(RuneString.inPlanes("\u{0}", [0, 16]), true);
  assertStrictEquals(RuneString.inPlanes("\u{FFFF}", [0, 16]), true);
  assertStrictEquals(RuneString.inPlanes("\u{0}", [1, 16]), false);
  assertStrictEquals(RuneString.inPlanes("\u{100000}", [0, 16]), true);
  assertStrictEquals(RuneString.inPlanes("\u{10FFFF}", [0, 16]), true);

  assertThrows(
    () => {
      RuneString.inPlanes("", []);
    },
    TypeError,
    "runeString",
  );

  assertThrows(
    () => {
      RuneString.inPlanes("00", []);
    },
    TypeError,
    "runeString",
  );

  assertThrows(
    () => {
      RuneString.inPlanes("0", undefined as unknown as []);
    },
    TypeError,
    "planes",
  );

  assertThrows(
    () => {
      RuneString.inPlanes("0", "0" as unknown as []);
    },
    TypeError,
    "planes",
  );

  assertThrows(
    () => {
      RuneString.inPlanes("0", [-1] as unknown as []);
    },
    TypeError,
    "planes[*]",
  );

  assertThrows(
    () => {
      RuneString.inPlanes("0", [17] as unknown as []);
    },
    TypeError,
    "planes[*]",
  );
});

Deno.test("RuneString.inCodePointRanges(string, number[])", () => {
  const blocks0: Array<[number] | [number, number]> = [];

  assertStrictEquals(RuneString.inCodePointRanges("\u{0}", blocks0), false);
  assertStrictEquals(RuneString.inCodePointRanges("\u{7F}", blocks0), false);
  assertStrictEquals(RuneString.inCodePointRanges("\u{80}", blocks0), false);
  assertStrictEquals(RuneString.inCodePointRanges("\u{FF}", blocks0), false);
  assertStrictEquals(RuneString.inCodePointRanges("\u{100}", blocks0), false);

  const blocks1 = [
    Block.C0_CONTROLS_AND_BASIC_LATIN,
    Block.C1_CONTROLS_AND_LATIN_1_SUPPLEMENT,
  ];

  assertStrictEquals(RuneString.inCodePointRanges("\u{0}", blocks1), true);
  assertStrictEquals(RuneString.inCodePointRanges("\u{7F}", blocks1), true);
  assertStrictEquals(RuneString.inCodePointRanges("\u{80}", blocks1), true);
  assertStrictEquals(RuneString.inCodePointRanges("\u{FF}", blocks1), true);
  assertStrictEquals(RuneString.inCodePointRanges("\u{100}", blocks1), false);

  const blocks2 = [
    Block.C1_CONTROLS_AND_LATIN_1_SUPPLEMENT,
    Block.C0_CONTROLS_AND_BASIC_LATIN,
  ];

  assertStrictEquals(RuneString.inCodePointRanges("\u{0}", blocks2), true);
  assertStrictEquals(RuneString.inCodePointRanges("\u{7F}", blocks2), true);
  assertStrictEquals(RuneString.inCodePointRanges("\u{80}", blocks2), true);
  assertStrictEquals(RuneString.inCodePointRanges("\u{FF}", blocks2), true);
  assertStrictEquals(RuneString.inCodePointRanges("\u{100}", blocks2), false);

  assertThrows(
    () => {
      RuneString.inCodePointRanges("", blocks1);
    },
    TypeError,
    "runeString",
  );

  assertThrows(
    () => {
      RuneString.inCodePointRanges("00", blocks1);
    },
    TypeError,
    "runeString",
  );

  assertThrows(
    () => {
      RuneString.inCodePointRanges("0", undefined as unknown as []);
    },
    TypeError,
    "ranges",
  );

  assertThrows(
    () => {
      RuneString.inCodePointRanges("0", 0 as unknown as []);
    },
    TypeError,
    "ranges",
  );

  assertThrows(
    () => {
      RuneString.inCodePointRanges("0", [0 as unknown as [0]]);
    },
    TypeError,
    "ranges[*]",
  );

  assertThrows(
    () => {
      RuneString.inCodePointRanges("0", [
        Block.C0_CONTROLS_AND_BASIC_LATIN,
        0 as unknown as [0],
      ]);
    },
    TypeError,
    "ranges[*]",
  );

  assertThrows(
    () => {
      RuneString.inCodePointRanges("0", [
        0 as unknown as [0],
        Block.C0_CONTROLS_AND_BASIC_LATIN,
      ]);
    },
    TypeError,
    "ranges[*]",
  );
});

Deno.test("RuneString.isVariationSelector(string)", () => {
  assertStrictEquals(RuneString.isVariationSelector("\uFDFF"), false);
  assertStrictEquals(RuneString.isVariationSelector("\uFE00"), true);
  assertStrictEquals(RuneString.isVariationSelector("\uFE0F"), true);
  assertStrictEquals(RuneString.isVariationSelector("\uFE10"), false);
  assertStrictEquals(RuneString.isVariationSelector("\u{E00FF}"), false);
  assertStrictEquals(RuneString.isVariationSelector("\u{E0100}"), true);
  assertStrictEquals(RuneString.isVariationSelector("\u{E01EF}"), true);
  assertStrictEquals(RuneString.isVariationSelector("\u{E01F0}"), false);
  assertStrictEquals(RuneString.isVariationSelector("\u180A"), false);
  assertStrictEquals(RuneString.isVariationSelector("\u180B"), true);
  assertStrictEquals(RuneString.isVariationSelector("\u180F"), true);
  assertStrictEquals(RuneString.isVariationSelector("\u1810"), false);
});

Deno.test("RuneString.matchesScripts(string, string[], boolean?)", () => {
  const scripts0 = ["Hira"];

  assertStrictEquals(RuneString.matchesScripts("あ", scripts0), true);
  assertStrictEquals(RuneString.matchesScripts("あ", scripts0, false), true);
  assertStrictEquals(RuneString.matchesScripts("あ", scripts0, true), true);
  assertStrictEquals(RuneString.matchesScripts("ア", scripts0), false);
  assertStrictEquals(RuneString.matchesScripts("ア", scripts0, false), false);
  assertStrictEquals(RuneString.matchesScripts("ア", scripts0, true), false);
  assertStrictEquals(RuneString.matchesScripts("ー", scripts0), true);
  assertStrictEquals(RuneString.matchesScripts("ー", scripts0, false), true);
  assertStrictEquals(RuneString.matchesScripts("ー", scripts0, true), false);
  assertStrictEquals(RuneString.matchesScripts("1", scripts0), false);
  assertStrictEquals(RuneString.matchesScripts("1", scripts0, false), false);
  assertStrictEquals(RuneString.matchesScripts("1", scripts0, true), false);

  const scripts1 = ["Hira", "Kana"];

  assertStrictEquals(RuneString.matchesScripts("あ", scripts1), true);
  assertStrictEquals(RuneString.matchesScripts("あ", scripts1, false), true);
  assertStrictEquals(RuneString.matchesScripts("あ", scripts1, true), true);
  assertStrictEquals(RuneString.matchesScripts("ア", scripts1), true);
  assertStrictEquals(RuneString.matchesScripts("ア", scripts1, false), true);
  assertStrictEquals(RuneString.matchesScripts("ア", scripts1, true), true);
  assertStrictEquals(RuneString.matchesScripts("ー", scripts1), true);
  assertStrictEquals(RuneString.matchesScripts("ー", scripts1, false), true);
  assertStrictEquals(RuneString.matchesScripts("ー", scripts1, true), false);
  assertStrictEquals(RuneString.matchesScripts("1", scripts1), false);
  assertStrictEquals(RuneString.matchesScripts("1", scripts1, false), false);
  assertStrictEquals(RuneString.matchesScripts("1", scripts1, true), false);

  const scripts2: string[] = [];

  assertStrictEquals(RuneString.matchesScripts("あ", scripts2), false);
  assertStrictEquals(RuneString.matchesScripts("あ", scripts2, false), false);
  assertStrictEquals(RuneString.matchesScripts("あ", scripts2, true), false);
  assertStrictEquals(RuneString.matchesScripts("ア", scripts2), false);
  assertStrictEquals(RuneString.matchesScripts("ア", scripts2, false), false);
  assertStrictEquals(RuneString.matchesScripts("ア", scripts2, true), false);
  assertStrictEquals(RuneString.matchesScripts("ー", scripts2), false);
  assertStrictEquals(RuneString.matchesScripts("ー", scripts2, false), false);
  assertStrictEquals(RuneString.matchesScripts("ー", scripts2, true), false);
  assertStrictEquals(RuneString.matchesScripts("1", scripts2), false);
  assertStrictEquals(RuneString.matchesScripts("1", scripts2, false), false);
  assertStrictEquals(RuneString.matchesScripts("1", scripts2, true), false);

  assertThrows(
    () => {
      RuneString.matchesScripts("", scripts1);
    },
    TypeError,
    "runeString",
  );

  assertThrows(
    () => {
      RuneString.matchesScripts("00", scripts1);
    },
    TypeError,
    "runeString",
  );

  assertThrows(
    () => {
      RuneString.matchesScripts("1", null as unknown as []);
    },
    TypeError,
    "scripts",
  );

  assertThrows(
    () => {
      RuneString.matchesScripts("1", ["HIRA"]);
    },
    TypeError,
    "scripts[*]",
  );
  assertThrows(
    () => {
      RuneString.matchesScripts("1", ["hira"]);
    },
    TypeError,
    "scripts[*]",
  );
  assertThrows(
    () => {
      RuneString.matchesScripts("1", ["Latn", "HIRA"]);
    },
    TypeError,
    "scripts[*]",
  );
  assertThrows(
    () => {
      RuneString.matchesScripts("1", ["HIRA", "Latn"]);
    },
    TypeError,
    "scripts[*]",
  );
});

Deno.test("RuneString.matchesGeneralCategories(string, string[])", () => {
  const cats0: Array<GeneralCategory> = [];

  assertStrictEquals(RuneString.matchesGeneralCategories("A", cats0), false);
  assertStrictEquals(RuneString.matchesGeneralCategories("1", cats0), false);
  assertStrictEquals(RuneString.matchesGeneralCategories("あ", cats0), false);
  assertStrictEquals(RuneString.matchesGeneralCategories(".", cats0), false);

  const cats1 = [GeneralCategory.LETTER];

  assertStrictEquals(RuneString.matchesGeneralCategories("A", cats1), true);
  assertStrictEquals(RuneString.matchesGeneralCategories("1", cats1), false);
  assertStrictEquals(RuneString.matchesGeneralCategories("あ", cats1), true);
  assertStrictEquals(RuneString.matchesGeneralCategories(".", cats1), false);

  const cats2 = [GeneralCategory.NUMBER];

  assertStrictEquals(RuneString.matchesGeneralCategories("A", cats2), false);
  assertStrictEquals(RuneString.matchesGeneralCategories("1", cats2), true);
  assertStrictEquals(RuneString.matchesGeneralCategories("あ", cats2), false);
  assertStrictEquals(RuneString.matchesGeneralCategories(".", cats2), false);

  const cats3 = [GeneralCategory.LETTER, GeneralCategory.NUMBER];

  assertStrictEquals(RuneString.matchesGeneralCategories("A", cats3), true);
  assertStrictEquals(RuneString.matchesGeneralCategories("1", cats3), true);
  assertStrictEquals(RuneString.matchesGeneralCategories("あ", cats3), true);
  assertStrictEquals(RuneString.matchesGeneralCategories(".", cats3), false);

  assertThrows(
    () => {
      RuneString.matchesGeneralCategories("", cats1);
    },
    TypeError,
    "runeString",
  );
  assertThrows(
    () => {
      RuneString.matchesGeneralCategories("00", cats1);
    },
    TypeError,
    "runeString",
  );

  assertThrows(
    () => {
      RuneString.matchesGeneralCategories(
        "0",
        0 as unknown as GeneralCategory[],
      );
    },
    TypeError,
    "generalCategories",
  );

  assertThrows(
    () => {
      RuneString.matchesGeneralCategories(
        "0",
        ["l"] as unknown as GeneralCategory[],
      );
    },
    TypeError,
    "generalCategories[*]",
  );
  assertThrows(
    () => {
      RuneString.matchesGeneralCategories(
        "0",
        ["L", "l"] as unknown as GeneralCategory[],
      );
    },
    TypeError,
    "generalCategories[*]",
  );
  assertThrows(
    () => {
      RuneString.matchesGeneralCategories(
        "0",
        ["l", "L"] as unknown as GeneralCategory[],
      );
    },
    TypeError,
    "generalCategories[*]",
  );
});
