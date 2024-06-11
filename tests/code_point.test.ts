import { assertStrictEquals, assertThrows } from "./deps.ts";
import { Block, CodePoint } from "../mod.ts";

Deno.test("CodePoint.isCodePoint(number)", () => {
  assertStrictEquals(CodePoint.isCodePoint(-1), false);
  assertStrictEquals(CodePoint.isCodePoint(-0), true);
  assertStrictEquals(CodePoint.isCodePoint(0), true);
  assertStrictEquals(CodePoint.isCodePoint(63), true);
  assertStrictEquals(CodePoint.isCodePoint(64), true);
  assertStrictEquals(CodePoint.isCodePoint(127), true);
  assertStrictEquals(CodePoint.isCodePoint(128), true);
  assertStrictEquals(CodePoint.isCodePoint(255), true);
  assertStrictEquals(CodePoint.isCodePoint(256), true);
  assertStrictEquals(CodePoint.isCodePoint(65535), true);
  assertStrictEquals(CodePoint.isCodePoint(65536), true);
  assertStrictEquals(CodePoint.isCodePoint(0x10FFFF), true);
  assertStrictEquals(CodePoint.isCodePoint(0x110000), false);
  assertStrictEquals(CodePoint.isCodePoint(0xFFFFFFFF), false);
  assertStrictEquals(CodePoint.isCodePoint(0x100000000), false);
  assertStrictEquals(CodePoint.isCodePoint(0.1), false);
});

Deno.test("CodePoint.isCodePoint(any)", () => {
  assertStrictEquals(CodePoint.isCodePoint("0"), false);
  assertStrictEquals(CodePoint.isCodePoint("255"), false);
  assertStrictEquals(CodePoint.isCodePoint(true), false);
  assertStrictEquals(CodePoint.isCodePoint({}), false);
  assertStrictEquals(CodePoint.isCodePoint([]), false);
  assertStrictEquals(CodePoint.isCodePoint([0]), false);
  assertStrictEquals(CodePoint.isCodePoint(undefined), false);
  assertStrictEquals(CodePoint.isCodePoint(null), false);
});

Deno.test("CodePoint.toString(number)", () => {
  assertStrictEquals(CodePoint.toString(0x0), "U+0000");
  assertStrictEquals(CodePoint.toString(0xFFFF), "U+FFFF");
  assertStrictEquals(CodePoint.toString(0x10000), "U+10000");
  assertStrictEquals(CodePoint.toString(0x10FFFF), "U+10FFFF");

  assertThrows(
    () => {
      CodePoint.toString(-1);
    },
    TypeError,
    "codePoint",
  );

  assertThrows(
    () => {
      CodePoint.toString(0x110000);
    },
    TypeError,
    "codePoint",
  );

  assertThrows(
    () => {
      CodePoint.toString("0" as unknown as number);
    },
    TypeError,
    "codePoint",
  );
});

Deno.test("CodePoint.planeOf(number)", () => {
  assertStrictEquals(CodePoint.planeOf(0x0), 0);
  assertStrictEquals(CodePoint.planeOf(0xFFFF), 0);
  assertStrictEquals(CodePoint.planeOf(0x10000), 1);
  assertStrictEquals(CodePoint.planeOf(0x1FFFF), 1);
  assertStrictEquals(CodePoint.planeOf(0x20000), 2);
  assertStrictEquals(CodePoint.planeOf(0x2FFFF), 2);
  assertStrictEquals(CodePoint.planeOf(0x30000), 3);
  assertStrictEquals(CodePoint.planeOf(0x3FFFF), 3);
  assertStrictEquals(CodePoint.planeOf(0x40000), 4);
  assertStrictEquals(CodePoint.planeOf(0x4FFFF), 4);
  assertStrictEquals(CodePoint.planeOf(0x50000), 5);
  assertStrictEquals(CodePoint.planeOf(0x5FFFF), 5);
  assertStrictEquals(CodePoint.planeOf(0x60000), 6);
  assertStrictEquals(CodePoint.planeOf(0x6FFFF), 6);
  assertStrictEquals(CodePoint.planeOf(0x70000), 7);
  assertStrictEquals(CodePoint.planeOf(0x7FFFF), 7);
  assertStrictEquals(CodePoint.planeOf(0x80000), 8);
  assertStrictEquals(CodePoint.planeOf(0x8FFFF), 8);
  assertStrictEquals(CodePoint.planeOf(0x90000), 9);
  assertStrictEquals(CodePoint.planeOf(0x9FFFF), 9);
  assertStrictEquals(CodePoint.planeOf(0xA0000), 10);
  assertStrictEquals(CodePoint.planeOf(0xAFFFF), 10);
  assertStrictEquals(CodePoint.planeOf(0xB0000), 11);
  assertStrictEquals(CodePoint.planeOf(0xBFFFF), 11);
  assertStrictEquals(CodePoint.planeOf(0xC0000), 12);
  assertStrictEquals(CodePoint.planeOf(0xCFFFF), 12);
  assertStrictEquals(CodePoint.planeOf(0xD0000), 13);
  assertStrictEquals(CodePoint.planeOf(0xDFFFF), 13);
  assertStrictEquals(CodePoint.planeOf(0xE0000), 14);
  assertStrictEquals(CodePoint.planeOf(0xEFFFF), 14);
  assertStrictEquals(CodePoint.planeOf(0xF0000), 15);
  assertStrictEquals(CodePoint.planeOf(0xFFFFF), 15);
  assertStrictEquals(CodePoint.planeOf(0x100000), 16);
  assertStrictEquals(CodePoint.planeOf(0x10FFFF), 16);

  assertThrows(
    () => {
      CodePoint.planeOf(-1);
    },
    TypeError,
    "codePoint",
  );

  assertThrows(
    () => {
      CodePoint.planeOf(0x110000);
    },
    TypeError,
    "codePoint",
  );

  assertThrows(
    () => {
      CodePoint.planeOf("0" as unknown as number);
    },
    TypeError,
    "codePoint",
  );
});

Deno.test("CodePoint.isBmp(number)", () => {
  assertStrictEquals(CodePoint.isBmp(0x0), true);
  assertStrictEquals(CodePoint.isBmp(0xFFFF), true);
  assertStrictEquals(CodePoint.isBmp(0x10000), false);
  assertStrictEquals(CodePoint.isBmp(0x10FFFF), false);

  assertThrows(
    () => {
      CodePoint.isBmp(-1);
    },
    TypeError,
    "codePoint",
  );

  assertThrows(
    () => {
      CodePoint.isBmp(0x110000);
    },
    TypeError,
    "codePoint",
  );
});

Deno.test("CodePoint.inPlanes(number, number[])", () => {
  assertStrictEquals(CodePoint.inPlanes(0x0, []), false);

  assertStrictEquals(CodePoint.inPlanes(0x0, [0]), true);
  assertStrictEquals(CodePoint.inPlanes(0xFFFF, [0]), true);
  assertStrictEquals(CodePoint.inPlanes(0x0, [1]), false);
  assertStrictEquals(CodePoint.inPlanes(0x100000, [16]), true);
  assertStrictEquals(CodePoint.inPlanes(0x10FFFF, [16]), true);

  assertStrictEquals(CodePoint.inPlanes(0x0, [0, 16]), true);
  assertStrictEquals(CodePoint.inPlanes(0xFFFF, [0, 16]), true);
  assertStrictEquals(CodePoint.inPlanes(0x0, [1, 16]), false);
  assertStrictEquals(CodePoint.inPlanes(0x100000, [0, 16]), true);
  assertStrictEquals(CodePoint.inPlanes(0x10FFFF, [0, 16]), true);

  assertThrows(
    () => {
      CodePoint.inPlanes(-1, []);
    },
    TypeError,
    "codePoint",
  );

  assertThrows(
    () => {
      CodePoint.inPlanes(0.5, []);
    },
    TypeError,
    "codePoint",
  );

  assertThrows(
    () => {
      CodePoint.inPlanes(0x110000, []);
    },
    TypeError,
    "codePoint",
  );

  assertThrows(
    () => {
      CodePoint.inPlanes(0, undefined as unknown as []);
    },
    TypeError,
    "planes",
  );

  assertThrows(
    () => {
      CodePoint.inPlanes(0, "0" as unknown as []);
    },
    TypeError,
    "planes",
  );

  assertThrows(
    () => {
      CodePoint.inPlanes(0, [-1] as unknown as []);
    },
    TypeError,
    "planes[*]",
  );

  assertThrows(
    () => {
      CodePoint.inPlanes(0, [17] as unknown as []);
    },
    TypeError,
    "planes[*]",
  );
});

Deno.test("CodePoint.isHighSurrogate(number)", () => {
  assertStrictEquals(CodePoint.isHighSurrogate(0xD7FF), false);
  assertStrictEquals(CodePoint.isHighSurrogate(0xD800), true);
  assertStrictEquals(CodePoint.isHighSurrogate(0xDBFF), true);
  assertStrictEquals(CodePoint.isHighSurrogate(0xDC00), false);
  assertStrictEquals(CodePoint.isHighSurrogate(0xDFFF), false);
  assertStrictEquals(CodePoint.isHighSurrogate(0xE000), false);

  assertThrows(
    () => {
      CodePoint.isHighSurrogate(-1);
    },
    TypeError,
    "codePoint",
  );

  assertThrows(
    () => {
      CodePoint.isHighSurrogate(0x110000);
    },
    TypeError,
    "codePoint",
  );
});

Deno.test("CodePoint.isLowSurrogate(number)", () => {
  assertStrictEquals(CodePoint.isLowSurrogate(0xD7FF), false);
  assertStrictEquals(CodePoint.isLowSurrogate(0xD800), false);
  assertStrictEquals(CodePoint.isLowSurrogate(0xDBFF), false);
  assertStrictEquals(CodePoint.isLowSurrogate(0xDC00), true);
  assertStrictEquals(CodePoint.isLowSurrogate(0xDFFF), true);
  assertStrictEquals(CodePoint.isLowSurrogate(0xE000), false);

  assertThrows(
    () => {
      CodePoint.isLowSurrogate(-1);
    },
    TypeError,
    "codePoint",
  );

  assertThrows(
    () => {
      CodePoint.isLowSurrogate(0x110000);
    },
    TypeError,
    "codePoint",
  );
});

Deno.test("CodePoint.inRanges(number, number[])", () => {
  const blocks0: Array<[number] | [number, number]> = [];

  assertStrictEquals(CodePoint.inRanges(0x0, blocks0), false);
  assertStrictEquals(CodePoint.inRanges(0x7F, blocks0), false);
  assertStrictEquals(CodePoint.inRanges(0x80, blocks0), false);
  assertStrictEquals(CodePoint.inRanges(0xFF, blocks0), false);
  assertStrictEquals(CodePoint.inRanges(0x100, blocks0), false);

  const blocks1 = [
    Block.C0_CONTROLS_AND_BASIC_LATIN,
    Block.C1_CONTROLS_AND_LATIN_1_SUPPLEMENT,
  ];

  assertStrictEquals(CodePoint.inRanges(0x0, blocks1), true);
  assertStrictEquals(CodePoint.inRanges(0x7F, blocks1), true);
  assertStrictEquals(CodePoint.inRanges(0x80, blocks1), true);
  assertStrictEquals(CodePoint.inRanges(0xFF, blocks1), true);
  assertStrictEquals(CodePoint.inRanges(0x100, blocks1), false);

  const blocks2 = [
    Block.C1_CONTROLS_AND_LATIN_1_SUPPLEMENT,
    Block.C0_CONTROLS_AND_BASIC_LATIN,
  ];

  assertStrictEquals(CodePoint.inRanges(0x0, blocks2), true);
  assertStrictEquals(CodePoint.inRanges(0x7F, blocks2), true);
  assertStrictEquals(CodePoint.inRanges(0x80, blocks2), true);
  assertStrictEquals(CodePoint.inRanges(0xFF, blocks2), true);
  assertStrictEquals(CodePoint.inRanges(0x100, blocks2), false);

  assertThrows(
    () => {
      CodePoint.inRanges(-1, blocks1);
    },
    TypeError,
    "codePoint",
  );

  assertThrows(
    () => {
      CodePoint.inRanges(0x110000, blocks1);
    },
    TypeError,
    "codePoint",
  );

  assertThrows(
    () => {
      CodePoint.inRanges(0, undefined as unknown as []);
    },
    TypeError,
    "ranges",
  );

  assertThrows(
    () => {
      CodePoint.inRanges(0, 0 as unknown as []);
    },
    TypeError,
    "ranges",
  );

  assertThrows(
    () => {
      CodePoint.inRanges(0, [0 as unknown as [0]]);
    },
    TypeError,
    "ranges[*]",
  );

  assertThrows(
    () => {
      CodePoint.inRanges(0, [
        Block.C0_CONTROLS_AND_BASIC_LATIN,
        0 as unknown as [0],
      ]);
    },
    TypeError,
    "ranges[*]",
  );

  assertThrows(
    () => {
      CodePoint.inRanges(0, [
        0 as unknown as [0],
        Block.C0_CONTROLS_AND_BASIC_LATIN,
      ]);
    },
    TypeError,
    "ranges[*]",
  );
});

Deno.test("CodePoint.isSurrogate(number)", () => {
  assertStrictEquals(CodePoint.isSurrogate(0xD7FF), false);
  assertStrictEquals(CodePoint.isSurrogate(0xD800), true);
  assertStrictEquals(CodePoint.isSurrogate(0xDBFF), true);
  assertStrictEquals(CodePoint.isSurrogate(0xDC00), true);
  assertStrictEquals(CodePoint.isSurrogate(0xDFFF), true);
  assertStrictEquals(CodePoint.isSurrogate(0xE000), false);

  assertThrows(
    () => {
      CodePoint.isSurrogate(-1);
    },
    TypeError,
    "codePoint",
  );

  assertThrows(
    () => {
      CodePoint.isSurrogate(0x110000);
    },
    TypeError,
    "codePoint",
  );
});

Deno.test("CodePoint.isVariationSelector(number)", () => {
  assertStrictEquals(CodePoint.isVariationSelector(0xFDFF), false);
  assertStrictEquals(CodePoint.isVariationSelector(0xFE00), true);
  assertStrictEquals(CodePoint.isVariationSelector(0xFE0F), true);
  assertStrictEquals(CodePoint.isVariationSelector(0xFE10), false);
  assertStrictEquals(CodePoint.isVariationSelector(0xE00FF), false);
  assertStrictEquals(CodePoint.isVariationSelector(0xE0100), true);
  assertStrictEquals(CodePoint.isVariationSelector(0xE01EF), true);
  assertStrictEquals(CodePoint.isVariationSelector(0xE01F0), false);
  assertStrictEquals(CodePoint.isVariationSelector(0x180A), false);
  assertStrictEquals(CodePoint.isVariationSelector(0x180B), true);
  assertStrictEquals(CodePoint.isVariationSelector(0x180F), true);
  assertStrictEquals(CodePoint.isVariationSelector(0x1810), false);
});
