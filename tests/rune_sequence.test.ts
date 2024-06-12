import { assertStrictEquals, assertThrows } from "./deps.ts";
import { Rune, RuneSequence } from "../mod.ts";

Deno.test("RuneSequence.prototype.charCount", () => {
  assertStrictEquals(RuneSequence.fromString("").charCount, 0);
  assertStrictEquals(RuneSequence.fromString("0").charCount, 1);
  assertStrictEquals(RuneSequence.fromString("\u{10000}").charCount, 2);
  assertStrictEquals(RuneSequence.fromString("\u{10FFFF}").charCount, 2);

  assertStrictEquals(RuneSequence.fromString("00").charCount, 2);
  assertStrictEquals(RuneSequence.fromString("\u{10000}0").charCount, 3);
  assertStrictEquals(
    RuneSequence.fromString("\u{10000}\u{10000}").charCount,
    4,
  );
});

Deno.test("RuneSequence.prototype.runeCount", () => {
  assertStrictEquals(RuneSequence.fromString("").runeCount, 0);
  assertStrictEquals(RuneSequence.fromString("0").runeCount, 1);
  assertStrictEquals(RuneSequence.fromString("\u{10000}").runeCount, 1);
  assertStrictEquals(RuneSequence.fromString("\u{10FFFF}").runeCount, 1);

  assertStrictEquals(RuneSequence.fromString("00").runeCount, 2);
  assertStrictEquals(RuneSequence.fromString("\u{10000}0").runeCount, 2);
  assertStrictEquals(
    RuneSequence.fromString("\u{10000}\u{10000}").runeCount,
    2,
  );
});

Deno.test("RuneSequence.fromString(string) , RuneSequence.prototype.toString()", () => {
  assertStrictEquals(RuneSequence.fromString("").toString(), "");
  assertStrictEquals(RuneSequence.fromString("0").toString(), "0");
  assertStrictEquals(
    RuneSequence.fromString("\u{10000}").toString(),
    "\u{10000}",
  );
  assertStrictEquals(
    RuneSequence.fromString("\u{10FFFF}").toString(),
    "\u{10FFFF}",
  );

  assertStrictEquals(RuneSequence.fromString("00").toString(), "00");
  assertStrictEquals(
    RuneSequence.fromString("\u{10000}0").toString(),
    "\u{10000}0",
  );
  assertStrictEquals(
    RuneSequence.fromString("\u{10000}\u{10000}").toString(),
    "\u{10000}\u{10000}",
  );

  assertStrictEquals(
    RuneSequence.fromString("\uD800\uDC00").toString(),
    "\uD800\uDC00",
  );

  assertThrows(
    () => {
      RuneSequence.fromString("\uD800");
    },
    TypeError,
    "runeString",
  );
  assertThrows(
    () => {
      RuneSequence.fromString("\uDFFF");
    },
    TypeError,
    "runeString",
  );
  assertThrows(
    () => {
      RuneSequence.fromString("\uDFFF");
    },
    TypeError,
    "runeString",
  );
  assertThrows(
    () => {
      RuneSequence.fromString("\uDC00\uD800");
    },
    TypeError,
    "runeString",
  );
  assertThrows(
    () => {
      RuneSequence.fromString("0\uD8000");
    },
    TypeError,
    "runeString",
  );
});

Deno.test("RuneSequence.fromRuneStrings(string[]) , RuneSequence.prototype.toRuneStrings()", () => {
  assertStrictEquals(
    RuneSequence.fromRuneStrings([]).toRuneStrings().join(","),
    "",
  );
  assertStrictEquals(
    RuneSequence.fromRuneStrings(["\u0000"]).toRuneStrings().join(","),
    "\u0000",
  );
  assertStrictEquals(
    RuneSequence.fromRuneStrings([
      "\u0000",
      "\uFFFF",
      "\u{10000}",
      "\u{10FFFF}",
    ]).toRuneStrings().join(","),
    "\u0000,\uFFFF,\u{10000},\u{10FFFF}",
  );
});

Deno.test("RuneSequence.fromRunes(Rune[]) , RuneSequence.prototype.toRunes()", () => {
  assertStrictEquals(RuneSequence.fromRunes([]).toString(), "");
  assertStrictEquals(
    RuneSequence.fromRunes([
      Rune.fromString("\u0000"),
    ]).toString(),
    "\u0000",
  );
  assertStrictEquals(
    RuneSequence.fromRunes([
      Rune.fromString("\u0000"),
      Rune.fromString("\uFFFF"),
      Rune.fromString("\u{10000}"),
      Rune.fromString("\u{10FFFF}"),
    ]).toString(),
    "\u0000\uFFFF\u{10000}\u{10FFFF}",
  );

  assertStrictEquals(
    RuneSequence.fromRunes([]).toRunes().map((rune) => rune.toString()).join(
      ",",
    ),
    "",
  );
  assertStrictEquals(
    RuneSequence.fromRunes([
      Rune.fromString("\u0000"),
    ]).toRunes().map((rune) => rune.toString()).join(","),
    "\u0000",
  );
  assertStrictEquals(
    RuneSequence.fromRunes([
      Rune.fromString("\u0000"),
      Rune.fromString("\uFFFF"),
      Rune.fromString("\u{10000}"),
      Rune.fromString("\u{10FFFF}"),
    ]).toRunes().map((rune) => rune.toString()).join(","),
    "\u0000,\uFFFF,\u{10000},\u{10FFFF}",
  );
});

Deno.test("RuneSequence.prototype.clone()", () => {
  assertStrictEquals(
    RuneSequence.fromRuneStrings([]).clone().toRuneStrings().join(","),
    "",
  );
  assertStrictEquals(
    RuneSequence.fromRuneStrings(["\u0000"]).clone().toRuneStrings().join(","),
    "\u0000",
  );
  assertStrictEquals(
    RuneSequence.fromRuneStrings([
      "\u0000",
      "\uFFFF",
      "\u{10000}",
      "\u{10FFFF}",
    ]).clone().toRuneStrings().join(","),
    "\u0000,\uFFFF,\u{10000},\u{10FFFF}",
  );
});

//TODO
//toCodePoints
//toCharCodes
//fromUtf8Encoded
//toUtf8Encoded
//fromUtf16beEncoded
//fromUtf16leEncoded
//fromUtf32beEncoded
//fromUtf32leEncoded
//toUtf16beEncoded
//toUtf16leEncoded
//toUtf32beEncoded
//toUtf32leEncoded
//at
//[Symbol.iterator]
