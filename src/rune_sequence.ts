import { _Utf16be, _Utf16le, _Utf32be, _Utf32le, _Utf8 } from "./_encoding.ts";
import { BufferUtils, SafeInteger, StringEx, Uint16 } from "../deps.ts";
import { CodePoint } from "./code_point.ts";
import { GraphemeCluster } from "./grapheme_cluster.ts";
import { Rune } from "./rune.ts";
import { RuneString } from "./rune_string.ts";

type _Bytes = BufferSource | Iterable<number>;

function _bytesToBuffer(bytes: _Bytes): BufferSource {
  if ((bytes instanceof ArrayBuffer) || ArrayBuffer.isView(bytes)) {
    return bytes;
  } else if (bytes && (Symbol.iterator in bytes)) {
    return BufferUtils.fromUint8Iterable(bytes); // bytesがiteratorを持ってない場合または要素がUint8ではない場合エラー
  }
  throw new TypeError("bytes");
}

export class RuneSequence {
  readonly #runes: Array<Rune>;

  private constructor(runes: Array<Rune>) {
    this.#runes = runes;
  }

  get charCount(): SafeInteger {
    return this.#runes.reduce(
      (accumulator: SafeInteger, currentValue: Rune) => {
        return accumulator + currentValue.charCount;
      },
      0,
    );
  }

  get runeCount(): SafeInteger {
    return this.#runes.length;
  }

  static fromString(source: string): RuneSequence {
    if (StringEx.isNonEmptyString(source) !== true) {
      new RuneSequence([]);
    }
    // if (source.isWellFormed() !== true) { // Rune.fromStringで同等のチェックはしている
    //   throw new RangeError("source");
    // }
    return RuneSequence.fromRunes(
      [...source].map((runeString) => Rune.fromString(runeString)),
    );
  }

  static fromRuneStrings(runeStringSequence: Iterable<string>): RuneSequence {
    if (
      StringEx.isString(runeStringSequence) ||
      ((Symbol.iterator in runeStringSequence) !== true)
    ) {
      throw new TypeError("");
    }

    return RuneSequence.fromRunes(
      [...runeStringSequence].map((runeString) => Rune.fromString(runeString)),
    );
  }

  static fromRunes(runes: Iterable<Rune>): RuneSequence {
    return new RuneSequence([...runes]);
  }

  //XXX options discardBom
  static fromUtf8Encoded(encoded: _Bytes): RuneSequence {
    const bytes = _bytesToBuffer(encoded);
    return RuneSequence.fromString(_Utf8.decode(bytes));
  }

  //XXX options discardBom
  static fromUtf16beEncoded(encoded: _Bytes): RuneSequence {
    const bytes = _bytesToBuffer(encoded);
    return RuneSequence.fromString(_Utf16be.decode(bytes));
  }

  //XXX options discardBom
  static fromUtf16leEncoded(encoded: _Bytes): RuneSequence {
    const bytes = _bytesToBuffer(encoded);
    return RuneSequence.fromString(_Utf16le.decode(bytes));
  }

  //XXX fromUtf16Encoded

  static fromCharCodes(charCodes: Iterable<number>): RuneSequence {
    const chars = [];
    for (const charCode of charCodes) {
      if (Uint16.isUint16(charCode) !== true) {
        throw new TypeError("charCodes[*]");
      }
      if (CodePoint.isSurrogate(charCode)) {
        throw new RangeError("charCodes[*]");
      }
      chars.push(String.fromCharCode(charCode));
    }
    return RuneSequence.fromString(chars.join(StringEx.EMPTY));
  }

  // charCodesが短いと6倍ほど遅いが、長ければ長いほどこちらが速くなる
  // static fromCharCodes2(
  //   charCodes: Iterable<number> | Uint16Array,
  // ): RuneSequence {
  //   let charCodesBuffer: ArrayBuffer;
  //   if ((charCodes instanceof ArrayBuffer) || ArrayBuffer.isView(charCodes)) {
  //     charCodesBuffer = charCodes;
  //   } else if (charCodes && (Symbol.iterator in charCodes)) {
  //     charCodesBuffer = BufferUtils.fromUint16Iterable(charCodes);
  //   } else {
  //     throw new TypeError("charCodes");
  //   }
  //   const decoded = (BufferUtils.BYTE_ORDER === ByteOrder.BIG_ENDIAN)
  //     ? _Utf16be.decode(charCodesBuffer)
  //     : _Utf16le.decode(charCodesBuffer);
  //   return RuneSequence.fromString(decoded);
  // }

  //XXX options discardBom
  static fromUtf32beEncoded(encoded: _Bytes): RuneSequence {
    const bytes = _bytesToBuffer(encoded);
    return RuneSequence.fromString(_Utf32be.decode(bytes));
  }

  //XXX options discardBom
  static fromUtf32leEncoded(encoded: _Bytes): RuneSequence {
    const bytes = _bytesToBuffer(encoded);
    return RuneSequence.fromString(_Utf32le.decode(bytes));
  }

  //XXX fromUtf32Encoded

  static fromCodePoints(codePoints: Iterable<number>): RuneSequence {
    const runeStrings = [];
    for (const codePoint of codePoints) {
      runeStrings.push(RuneString.fromCodePoint(codePoint));
    }
    return RuneSequence.fromRuneStrings(runeStrings);
  }

  duplicate(): RuneSequence {
    return new RuneSequence(this.toRunes());
  }

  //XXX equals

  //XXX startsWith

  // 孤立サロゲートは絶対に発生しないが、結合文字は分解される可能性あり
  subsequence(start: number, end?: number): RuneSequence {
    if (SafeInteger.isNonNegativeSafeInteger(start) !== true) {
      throw new TypeError("start");
    }
    if (start > this.runeCount) {
      throw new RangeError("start");
    }

    if (typeof end === "number") {
      if (SafeInteger.isNonNegativeSafeInteger(end) !== true) {
        throw new TypeError("end");
      }
      if (end < start) {
        throw new RangeError("end");
      }
    }

    return new RuneSequence(this.#runes.slice(start, end));
  }

  toNormalized(form: RuneSequence.NormalizationForm): RuneSequence {
    if (Object.values(RuneSequence.NormalizationForm).includes(form) !== true) {
      throw new TypeError("form");
    }
    return RuneSequence.fromString(this.toString().normalize(form));
  }

  //XXX normalize(form): void 破壊的メソッド版

  // すべてのVSを位置に関係なく除去（もともとRuneSequence自体は、不正な位置にVSがあっても関知しない）
  withoutVariationSelectors(/*XXX options */): RuneSequence {
    return RuneSequence.fromString(
      this.toString().replaceAll(
        /[\u180B-\u180F\uFE00-\uFE0F\u{E0100}-\u{E01EF}]/gu,
        StringEx.EMPTY,
      ),
    );
  }

  //XXX withoutVariationSelectorsの破壊的メソッド版
  // removeVariationSelectors(): void {
  // }

  toGraphemeClusters(localeTag: string): Array<RuneSequence> {
    const graphemeClusters = GraphemeCluster.stringToGraphemeClusters(
      this.toString(),
      localeTag,
    );
    return graphemeClusters.map((graphemeCluster) =>
      RuneSequence.fromString(graphemeCluster)
    );
  }

  at(index: number): Rune | undefined {
    return this.#runes.at(index);
  }

  [Symbol.iterator](): IterableIterator<Rune> {
    return this.#runes[Symbol.iterator]();
  }

  toString(): string {
    return this.toRuneStrings().join(StringEx.EMPTY);
  }

  toRuneStrings(): Array<string> {
    return this.#runes.map((rune) => rune.toString());
  }

  toRunes(): Array<Rune> {
    return this.#runes.map((rune) => rune.duplicate());
  }

  //XXX options discardBom
  toUtf8Encoded(): Uint8Array {
    return _Utf8.encode(this.toString());
  }

  //XXX options discardBom
  toUtf16beEncoded(): Uint8Array {
    return _Utf16be.encode(this.toString());
  }

  //XXX options discardBom
  toUtf16leEncoded(): Uint8Array {
    return _Utf16le.encode(this.toString());
  }

  //XXX toUtf16Encoded

  toCharCodes(): Array<[Uint16] | [Uint16, Uint16]> {
    return this.#runes.map((rune) => rune.toCharCodes());
  }

  //XXX options discardBom
  toUtf32beEncoded(): Uint8Array {
    return _Utf32be.encode(this.toString());
  }

  //XXX options discardBom
  toUtf32leEncoded(): Uint8Array {
    return _Utf32le.encode(this.toString());
  }

  //XXX toUtf32Encoded

  toCodePoints(): Array<CodePoint> {
    return this.#runes.map((rune) => rune.toCodePoint());
  }
}

export namespace RuneSequence {
  export const NormalizationForm = {
    FORM_C: "NFC",
    FORM_D: "NFD",
  } as const;
  export type NormalizationForm =
    typeof NormalizationForm[keyof typeof NormalizationForm];
}
