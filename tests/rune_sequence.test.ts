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

Deno.test("RuneSequence.prototype.duplicate()", () => {
  assertStrictEquals(
    RuneSequence.fromRuneStrings([]).duplicate().toRuneStrings().join(","),
    "",
  );
  assertStrictEquals(
    RuneSequence.fromRuneStrings(["\u0000"]).duplicate().toRuneStrings().join(
      ",",
    ),
    "\u0000",
  );
  assertStrictEquals(
    RuneSequence.fromRuneStrings([
      "\u0000",
      "\uFFFF",
      "\u{10000}",
      "\u{10FFFF}",
    ]).duplicate().toRuneStrings().join(","),
    "\u0000,\uFFFF,\u{10000},\u{10FFFF}",
  );
});

Deno.test("RuneSequence.fromUtf8Encoded()", () => {
  assertStrictEquals(RuneSequence.fromUtf8Encoded([]).toString(), "");
  assertStrictEquals(
    RuneSequence.fromUtf8Encoded([227, 129, 130, 97, 49]).toString(),
    "あa1",
  );
  assertThrows(
    () => {
      RuneSequence.fromUtf8Encoded([227, 129, 130, 97, 0xED, 0xA0, 0x80, 49]);
    },
    TypeError,
    //"The encoded data is not valid.",
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
  assertThrows(
    () => {
      RuneSequence.fromUtf8Encoded(
        Uint8Array.of(227, 129, 130, 97, 0xED, 0xA0, 0x80, 49),
      );
    },
    TypeError,
    //"The encoded data is not valid.",
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
  assertThrows(
    () => {
      RuneSequence.fromUtf8Encoded(
        Uint8Array.of(227, 129, 130, 97, 0xED, 0xA0, 0x80, 49).buffer,
      );
    },
    TypeError,
    //"The encoded data is not valid.",
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
  assertStrictEquals(
    [...RuneSequence.fromString("あ\u{10000}a1").toCharCodes()].join(","),
    "12354,55296,56320,97,49",
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

Deno.test("RuneSequence.prototype.toCodePoints()", () => {
  assertStrictEquals(
    [...RuneSequence.fromString("").toCodePoints()].join(","),
    "",
  );
  assertStrictEquals(
    [...RuneSequence.fromString("あa1").toCodePoints()].join(","),
    "12354,97,49",
  );
  assertStrictEquals(
    [...RuneSequence.fromString("あ\u{10000}a1").toCodePoints()].join(","),
    "12354,65536,97,49",
  );
  // Runeは孤立サロゲートを許容してない
});

Deno.test("RuneSequence.prototype.at()", () => {
  assertStrictEquals(
    RuneSequence.fromString("").at(0),
    undefined,
  );
  const r1 = RuneSequence.fromString("あa1");
  assertStrictEquals(r1.at(0)?.toString(), "あ");
  assertStrictEquals(r1.at(1)?.toString(), "a");
  assertStrictEquals(r1.at(2)?.toString(), "1");
  const r2 = RuneSequence.fromString("あ\u{10000}a1");
  assertStrictEquals(r2.at(0)?.toString(), "あ");
  assertStrictEquals(r2.at(1)?.toString(), "\u{10000}");
  assertStrictEquals(r2.at(2)?.toString(), "a");
  assertStrictEquals(r2.at(3)?.toString(), "1");
  assertStrictEquals(r2.at(4)?.toString(), undefined);
  assertStrictEquals(r2.at(-1)?.toString(), "1");
  assertStrictEquals(r2.at(-2)?.toString(), "a");
  assertStrictEquals(r2.at(-3)?.toString(), "\u{10000}");
  assertStrictEquals(r2.at(-4)?.toString(), "あ");
  assertStrictEquals(r2.at(-5)?.toString(), undefined);
});

Deno.test("RuneSequence.prototype.[Symbol.iterator]()", () => {
  const r2 = RuneSequence.fromString("あ\u{10000}a1");
  let i = 0;
  for (const r of r2) {
    if (i === 0) assertStrictEquals(r.toString(), "あ");
    else if (i === 1) assertStrictEquals(r.toString(), "\u{10000}");
    else if (i === 2) assertStrictEquals(r.toString(), "a");
    else if (i === 3) assertStrictEquals(r.toString(), "1");
    i++;
  }
  assertStrictEquals(i, 4);
});

Deno.test("RuneSequence.prototype.toNormalized(string)", () => {
  assertStrictEquals(
    RuneSequence.fromString("").toNormalized("NFC").toString(),
    "",
  );

  assertStrictEquals(
    RuneSequence.fromString("が").toNormalized("NFC").toString(),
    "が",
  );
  assertStrictEquals(
    RuneSequence.fromString("か\u3099").toNormalized("NFC").toString(),
    "が",
  );
  assertStrictEquals(
    RuneSequence.fromString("👨‍👦").toNormalized("NFC").toString(),
    "👨‍👦",
  );
  assertStrictEquals(
    RuneSequence.fromString("\u8328\u{E0100}").toNormalized("NFC").toString(),
    "\u8328\u{E0100}",
  );
  assertStrictEquals(
    RuneSequence.fromString("\uFA30").toNormalized("NFC").toString(),
    "\u4FAE",
  );
  assertStrictEquals(
    RuneSequence.fromString("\u4FAE\uFE00").toNormalized("NFC").toString(),
    "\u4FAE\uFE00",
  );

  assertStrictEquals(
    RuneSequence.fromString("").toNormalized("NFD").toString(),
    "",
  );

  assertStrictEquals(
    RuneSequence.fromString("が").toNormalized("NFD").toString(),
    "か\u3099",
  );
  assertStrictEquals(
    RuneSequence.fromString("か\u3099").toNormalized("NFD").toString(),
    "か\u3099",
  );
  assertStrictEquals(
    RuneSequence.fromString("👨‍👦").toNormalized("NFD").toString(),
    "👨‍👦",
  );
  assertStrictEquals(
    RuneSequence.fromString("\u8328\u{E0100}").toNormalized("NFD").toString(),
    "\u8328\u{E0100}",
  );
  assertStrictEquals(
    RuneSequence.fromString("\uFA30").toNormalized("NFD").toString(),
    "\u4FAE",
  );
  assertStrictEquals(
    RuneSequence.fromString("\u4FAE\uFE00").toNormalized("NFD").toString(),
    "\u4FAE\uFE00",
  );

  assertThrows(
    () => {
      RuneSequence.fromString("が").toNormalized("NFKD" as unknown as "NFC");
    },
    TypeError,
  );
  assertThrows(
    () => {
      RuneSequence.fromString("が").toNormalized("NFKC" as unknown as "NFC");
    },
    TypeError,
  );
});

Deno.test("RuneSequence.prototype.toGraphemeClusters(string)", () => {
  const r0 = RuneSequence.fromString("");
  assertStrictEquals(r0.toGraphemeClusters("ja").length, 0);

  assertThrows(
    () => {
      r0.toGraphemeClusters("");
    },
    RangeError,
    //"",
  );
  assertThrows(
    () => {
      r0.toGraphemeClusters("a");
    },
    RangeError,
    //"",
  );
  assertThrows(
    () => {
      r0.toGraphemeClusters("aaaa");
    },
    RangeError,
    //"",
  );

  const r1 = RuneSequence.fromString("あ\u{10000}a1");
  const r1g1 = r1.toGraphemeClusters("ja");
  assertStrictEquals(r1g1.length, 4);
  assertStrictEquals(r1g1[0].toString(), "あ");
  assertStrictEquals(r1g1[1].toString(), "\u{10000}");
  assertStrictEquals(r1g1[2].toString(), "a");
  assertStrictEquals(r1g1[3].toString(), "1");

  const r2 = RuneSequence.fromString(
    "か1が2か\u30993👨‍👦4\u83288\u8328\u{E0100}9",
  );
  const r2g1 = r2.toGraphemeClusters("ja");
  assertStrictEquals(r2g1.length, 12);
  assertStrictEquals(r2g1[0].toString(), "か");
  assertStrictEquals(r2g1[1].toString(), "1");
  assertStrictEquals(r2g1[2].toString(), "が");
  assertStrictEquals(r2g1[3].toString(), "2");
  assertStrictEquals(r2g1[4].toString(), "か\u3099");
  assertStrictEquals(r2g1[5].toString(), "3");
  assertStrictEquals(r2g1[6].toString(), "👨‍👦");
  assertStrictEquals(r2g1[7].toString(), "4");
  assertStrictEquals(r2g1[8].toString(), "茨");
  assertStrictEquals(r2g1[9].toString(), "8");
  assertStrictEquals(r2g1[10].toString(), "茨󠄀");
  assertStrictEquals(r2g1[11].toString(), "9");
});

Deno.test("RuneSequence.prototype.subsequence(number)", () => {
  const r1 = RuneSequence.fromString("0123456789");
  assertStrictEquals(r1.subsequence(0).toString(), "0123456789");
  assertStrictEquals(r1.subsequence(0, 5).toString(), "01234");
  assertStrictEquals(r1.subsequence(2).toString(), "23456789");
  assertStrictEquals(r1.subsequence(2, 5).toString(), "234");
  assertStrictEquals(r1.subsequence(9).toString(), "9");
  assertStrictEquals(r1.subsequence(10).toString(), "");
  assertStrictEquals(r1.subsequence(2, 2).toString(), "");

  assertThrows(
    () => {
      r1.subsequence("" as unknown as number);
    },
    TypeError,
    "start",
  );
  assertThrows(
    () => {
      r1.subsequence(-1);
    },
    TypeError,
    "start",
  );
  assertThrows(
    () => {
      r1.subsequence(11);
    },
    RangeError,
    "start",
  );

  // assertThrows(
  //   () => {
  //     r1.subsequence(0, "" as unknown as number);
  //   },
  //   TypeError,
  //   "end",
  // );//XXX えらーにすべき？
  assertThrows(
    () => {
      r1.subsequence(0, -1);
    },
    TypeError,
    "end",
  );
  assertThrows(
    () => {
      r1.subsequence(2, 1);
    },
    RangeError,
    "end",
  );
});
