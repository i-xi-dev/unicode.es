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

Deno.test("RuneSequence.fromUtf8Encoded()", () => {
  assertStrictEquals(RuneSequence.fromUtf8Encoded([]).toString(), "");
  assertStrictEquals(
    RuneSequence.fromUtf8Encoded([227, 129, 130, 97, 49]).toString(),
    "あa1",
  );
  assertStrictEquals(
    RuneSequence.fromUtf8Encoded([227, 129, 130, 97, 239, 191, 189, 49])
      .toString(),
    //"あa\uD8001", //TODO utf16,32も同じ仕様か
    "あa\uFFFD1",
  );

  assertStrictEquals(
    RuneSequence.fromUtf8Encoded(Uint8Array.of()).toString(),
    "",
  );
  assertStrictEquals(
    RuneSequence.fromUtf8Encoded(Uint8Array.of(227, 129, 130, 97, 49))
      .toString(),
    "あa1",
  );
  assertStrictEquals(
    RuneSequence.fromUtf8Encoded(
      Uint8Array.of(227, 129, 130, 97, 239, 191, 189, 49),
    ).toString(),
    //"あa\uD8001", //TODO utf16,32も同じ仕様か
    "あa\uFFFD1",
  );

  assertStrictEquals(
    RuneSequence.fromUtf8Encoded(Uint8Array.of().buffer).toString(),
    "",
  );
  assertStrictEquals(
    RuneSequence.fromUtf8Encoded(Uint8Array.of(227, 129, 130, 97, 49).buffer)
      .toString(),
    "あa1",
  );
  assertStrictEquals(
    RuneSequence.fromUtf8Encoded(
      Uint8Array.of(227, 129, 130, 97, 239, 191, 189, 49).buffer,
    ).toString(),
    //"あa\uD8001", //TODO utf16,32も同じ仕様か
    "あa\uFFFD1",
  );
});

Deno.test("RuneSequence.prototype.toUtf8Encoded()", () => {
  assertStrictEquals(
    [...RuneSequence.fromString("").toUtf8Encoded()].join(","),
    "",
  );
  assertStrictEquals(
    [...RuneSequence.fromString("あa1").toUtf8Encoded()].join(","),
    "227,129,130,97,49",
  );
  // assertStrictEquals(
  //   [...RuneSequence.fromString("あa\uD8001").toUtf8Encoded()].join(","),
  //   "227,129,130,97,239,191,189,49",
  // ); Runeは孤立サロゲートを許容してない
});

Deno.test("RuneSequence.fromUtf16beEncoded()", () => {
  assertStrictEquals(RuneSequence.fromUtf16beEncoded([]).toString(), "");
  assertStrictEquals(
    RuneSequence.fromUtf16beEncoded([0x30, 0x42, 0, 97, 0, 49]).toString(),
    "あa1",
  );
  assertThrows(
    () => {
      RuneSequence.fromUtf16beEncoded([0x30, 0x42, 0, 97, 0xD8, 0, 0, 49]);
    },
    TypeError,
    //"The encoded data is not valid.",
  );

  assertStrictEquals(
    RuneSequence.fromUtf16beEncoded(Uint8Array.of()).toString(),
    "",
  );
  assertStrictEquals(
    RuneSequence.fromUtf16beEncoded(Uint8Array.of(0x30, 0x42, 0, 97, 0, 49))
      .toString(),
    "あa1",
  );
  assertThrows(
    () => {
      RuneSequence.fromUtf16beEncoded(
        Uint8Array.of(0x30, 0x42, 0, 97, 0xD8, 0, 0, 49),
      );
    },
    TypeError,
    //"The encoded data is not valid.",
  );
});

Deno.test("RuneSequence.prototype.toUtf16beEncoded()", () => {
  assertStrictEquals(
    [...RuneSequence.fromString("").toUtf16beEncoded()].join(","),
    "",
  );
  assertStrictEquals(
    [...RuneSequence.fromString("あa1").toUtf16beEncoded()].join(","),
    "48,66,0,97,0,49",
  );
  // Runeは孤立サロゲートを許容してない
});

Deno.test("RuneSequence.fromUtf16leEncoded()", () => {
  assertStrictEquals(RuneSequence.fromUtf16leEncoded([]).toString(), "");
  assertStrictEquals(
    RuneSequence.fromUtf16leEncoded([0x42, 0x30, 97, 0, 49, 0]).toString(),
    "あa1",
  );
  assertThrows(
    () => {
      RuneSequence.fromUtf16leEncoded([0x42, 0x30, 97, 0, 0, 0xD8, 49, 0]);
    },
    TypeError,
    //"The encoded data is not valid.",
  );

  assertStrictEquals(
    RuneSequence.fromUtf16leEncoded(Uint8Array.of()).toString(),
    "",
  );
  assertStrictEquals(
    RuneSequence.fromUtf16leEncoded(Uint8Array.of(0x42, 0x30, 97, 0, 49, 0))
      .toString(),
    "あa1",
  );
  assertThrows(
    () => {
      RuneSequence.fromUtf16leEncoded(
        Uint8Array.of(0x42, 0x30, 97, 0, 0, 0xD8, 49, 0),
      );
    },
    TypeError,
    //"The encoded data is not valid.",
  );
});

Deno.test("RuneSequence.prototype.toUtf16leEncoded()", () => {
  assertStrictEquals(
    [...RuneSequence.fromString("").toUtf16leEncoded()].join(","),
    "",
  );
  assertStrictEquals(
    [...RuneSequence.fromString("あa1").toUtf16leEncoded()].join(","),
    "66,48,97,0,49,0",
  );
  // Runeは孤立サロゲートを許容してない
});

Deno.test("RuneSequence.fromCharCodes()", () => {
  assertStrictEquals(RuneSequence.fromCharCodes([]).toString(), "");
  assertStrictEquals(
    RuneSequence.fromCharCodes([0x3042, 97, 49]).toString(),
    "あa1",
  );
  assertThrows(
    () => {
      RuneSequence.fromCharCodes([0x3042, 97, 0xD800, 49]);
    },
    RangeError,
    //"The encoded data is not valid.",
  );

  assertThrows(
    () => {
      RuneSequence.fromCharCodes([0x3042, 97, 0x10000, 49]);
    },
    TypeError,
  );

  assertStrictEquals(
    RuneSequence.fromCharCodes(Uint16Array.of()).toString(),
    "",
  );
  assertStrictEquals(
    RuneSequence.fromCharCodes(Uint16Array.of(0x3042, 97, 49))
      .toString(),
    "あa1",
  );
  assertThrows(
    () => {
      RuneSequence.fromCharCodes(
        Uint16Array.of(0x3042, 97, 0xD800, 49),
      );
    },
    RangeError,
    //"The encoded data is not valid.",
  );
});

Deno.test("RuneSequence.prototype.toCharCodes()", () => {
  assertStrictEquals(
    [...RuneSequence.fromString("").toCharCodes()].join(","),
    "",
  );
  assertStrictEquals(
    [...RuneSequence.fromString("あa1").toCharCodes()].join(","),
    "12354,97,49",
  );
  // Runeは孤立サロゲートを許容してない
});

Deno.test("RuneSequence.fromUtf32beEncoded()", () => {
  assertStrictEquals(RuneSequence.fromUtf32beEncoded([]).toString(), "");
  assertStrictEquals(
    RuneSequence.fromUtf32beEncoded([
      0,
      0,
      0x30,
      0x42,
      0,
      0,
      0,
      97,
      0,
      0,
      0,
      49,
    ]).toString(),
    "あa1",
  );
  assertThrows(
    () => {
      RuneSequence.fromUtf32beEncoded([
        0,
        0,
        0x30,
        0x42,
        0,
        0,
        0,
        97,
        0,
        0,
        0xD8,
        0,
        0,
        0,
        0,
        49,
      ]);
    },
    TypeError,
    //"The encoded data is not valid.",
  );

  assertStrictEquals(
    RuneSequence.fromUtf32beEncoded(Uint8Array.of()).toString(),
    "",
  );
  assertStrictEquals(
    RuneSequence.fromUtf32beEncoded(
      Uint8Array.of(0, 0, 0x30, 0x42, 0, 0, 0, 97, 0, 0, 0, 49),
    )
      .toString(),
    "あa1",
  );
  assertThrows(
    () => {
      RuneSequence.fromUtf32beEncoded(
        Uint8Array.of(
          0,
          0,
          0x30,
          0x42,
          0,
          0,
          0,
          97,
          0,
          0,
          0xD8,
          0,
          0,
          0,
          0,
          49,
        ),
      );
    },
    TypeError,
    //"The encoded data is not valid.",
  );
});

Deno.test("RuneSequence.prototype.toUtf32beEncoded()", () => {
  assertStrictEquals(
    [...RuneSequence.fromString("").toUtf32beEncoded()].join(","),
    "",
  );
  assertStrictEquals(
    [...RuneSequence.fromString("あa1").toUtf32beEncoded()].join(","),
    "0,0,48,66,0,0,0,97,0,0,0,49",
  );
  // Runeは孤立サロゲートを許容してない
});

Deno.test("RuneSequence.fromUtf32leEncoded()", () => {
  assertStrictEquals(RuneSequence.fromUtf32leEncoded([]).toString(), "");
  assertStrictEquals(
    RuneSequence.fromUtf32leEncoded([
      0x42,
      0x30,
      0,
      0,
      97,
      0,
      0,
      0,
      49,
      0,
      0,
      0,
    ]).toString(),
    "あa1",
  );
  assertThrows(
    () => {
      RuneSequence.fromUtf32leEncoded([
        0x42,
        0x30,
        0,
        0,
        97,
        0,
        0,
        0,
        0,
        0xD8,
        0,
        0,
        49,
        0,
        0,
        0,
      ]);
    },
    TypeError,
    //"The encoded data is not valid.",
  );

  assertStrictEquals(
    RuneSequence.fromUtf32leEncoded(Uint8Array.of()).toString(),
    "",
  );
  assertStrictEquals(
    RuneSequence.fromUtf32leEncoded(
      Uint8Array.of(0x42, 0x30, 0, 0, 97, 0, 0, 0, 49, 0, 0, 0),
    )
      .toString(),
    "あa1",
  );
  assertThrows(
    () => {
      RuneSequence.fromUtf32leEncoded(
        Uint8Array.of(
          0x42,
          0x30,
          0,
          0,
          97,
          0,
          0,
          0,
          0,
          0xD8,
          0,
          0,
          49,
          0,
          0,
          0,
        ),
      );
    },
    TypeError,
    //"The encoded data is not valid.",
  );
});

Deno.test("RuneSequence.prototype.toUtf32leEncoded()", () => {
  assertStrictEquals(
    [...RuneSequence.fromString("").toUtf32leEncoded()].join(","),
    "",
  );
  assertStrictEquals(
    [...RuneSequence.fromString("あa1").toUtf32leEncoded()].join(","),
    "66,48,0,0,97,0,0,0,49,0,0,0",
  );
  // Runeは孤立サロゲートを許容してない
});

Deno.test("RuneSequence.fromCodePoints()", () => {
  assertStrictEquals(RuneSequence.fromCodePoints([]).toString(), "");
  assertStrictEquals(
    RuneSequence.fromCodePoints([0x3042, 97, 49]).toString(),
    "あa1",
  );
  assertThrows(
    () => {
      RuneSequence.fromCodePoints([0x3042, 97, 0xD800, 49]);
    },
    RangeError,
    //"The encoded data is not valid.",
  );

  assertThrows(
    () => {
      RuneSequence.fromCodePoints([0x110000, 97, 0xD800, 49]);
    },
    TypeError,
  );

  assertStrictEquals(
    RuneSequence.fromCodePoints(Uint32Array.of()).toString(),
    "",
  );
  assertStrictEquals(
    RuneSequence.fromCodePoints(
      Uint32Array.of(0x3042, 97, 49),
    )
      .toString(),
    "あa1",
  );
  assertThrows(
    () => {
      RuneSequence.fromCodePoints(
        Uint32Array.of(0x3042, 97, 0xD800, 49),
      );
    },
    RangeError,
    //"The encoded data is not valid.",
  );
});

//TODO
//toCodePoints
//at
//[Symbol.iterator]
