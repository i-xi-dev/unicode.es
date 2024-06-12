import {
  BufferUtils,
  ByteOrder,
  SafeInteger,
  StringEx,
  Uint16,
} from "../deps.ts";
import { CodePoint } from "./code_point.ts";
import { Rune } from "./rune.ts";
import { Utf32 } from "./utf32.ts";

let _utf8Decoder: WeakRef<TextDecoder>;
function _utf8Decode(bytes: BufferSource): string {
  if (!_utf8Decoder || !_utf8Decoder.deref()) {
    _utf8Decoder = new WeakRef(
      new TextDecoder("utf-8", {
        fatal: true,
      }),
    );
  }
  return _utf8Decoder.deref()!.decode(bytes);
}

let _utf16beDecoder: WeakRef<TextDecoder>;
function _utf16beDecode(bytes: BufferSource): string {
  if (!_utf16beDecoder || !_utf16beDecoder.deref()) {
    _utf16beDecoder = new WeakRef(
      new TextDecoder("utf-16be", {
        fatal: true,
      }),
    );
  }
  return _utf16beDecoder.deref()!.decode(bytes);
}

let _utf16leDecoder: WeakRef<TextDecoder>;
function _utf16leDecode(bytes: BufferSource): string {
  if (!_utf16leDecoder || !_utf16leDecoder.deref()) {
    _utf16leDecoder = new WeakRef(
      new TextDecoder("utf-16le", {
        fatal: true,
      }),
    );
  }
  return _utf16leDecoder.deref()!.decode(bytes);
}

let _utf32beDecoder: WeakRef<Utf32.Be.Decoder>;
function _utf32beDecode(bytes: BufferSource): string {
  if (!_utf32beDecoder || !_utf32beDecoder.deref()) {
    _utf32beDecoder = new WeakRef(
      new Utf32.Be.Decoder({
        fatal: true,
      }),
    );
  }
  return _utf32beDecoder.deref()!.decode(bytes);
}

let _utf32leDecoder: WeakRef<Utf32.Be.Decoder>;
function _utf32leDecode(bytes: BufferSource): string {
  if (!_utf32leDecoder || !_utf32leDecoder.deref()) {
    _utf32leDecoder = new WeakRef(
      new Utf32.Le.Decoder({
        fatal: true,
      }),
    );
  }
  return _utf32leDecoder.deref()!.decode(bytes);
}

let _utf8Encoder: WeakRef<TextEncoder>;
function _utf8Encode(str: string): Uint8Array {
  if (!_utf8Encoder || !_utf8Encoder.deref()) {
    _utf8Encoder = new WeakRef(new TextEncoder());
  }
  return _utf8Encoder.deref()!.encode(str);
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
  static fromUtf8Encoded(encoded: RuneSequence.Encoded): RuneSequence {
    if ((encoded instanceof ArrayBuffer) || ArrayBuffer.isView(encoded)) {
      return RuneSequence.fromString(_utf8Decode(encoded));
    } else if (encoded) {
      const bytes = BufferUtils.fromUint8Iterable(encoded);
      return RuneSequence.fromString(_utf8Decode(bytes));
    }
    throw new TypeError("encoded");
  }

  //XXX options discardBom
  static fromUtf16beEncoded(encoded: RuneSequence.Encoded): RuneSequence {
    if ((encoded instanceof ArrayBuffer) || ArrayBuffer.isView(encoded)) {
      return RuneSequence.fromString(_utf16beDecode(encoded));
    } else if (encoded) {
      const bytes = BufferUtils.fromUint16Iterable(
        encoded,
        ByteOrder.BIG_ENDIAN,
      );
      return RuneSequence.fromString(_utf16beDecode(bytes));
    }
    throw new TypeError("encoded");
  }

  //XXX options discardBom
  static fromUtf16leEncoded(encoded: RuneSequence.Encoded): RuneSequence {
    if ((encoded instanceof ArrayBuffer) || ArrayBuffer.isView(encoded)) {
      return RuneSequence.fromString(_utf16leDecode(encoded));
    } else if (encoded) {
      const bytes = BufferUtils.fromUint16Iterable(
        encoded,
        ByteOrder.LITTLE_ENDIAN,
      );
      return RuneSequence.fromString(_utf16leDecode(bytes));
    }
    throw new TypeError("encoded");
  }

  //XXX fromUtf16Encoded

  //XXX options discardBom
  static fromUtf32beEncoded(encoded: RuneSequence.Encoded): RuneSequence {
    if ((encoded instanceof ArrayBuffer) || ArrayBuffer.isView(encoded)) {
      return RuneSequence.fromString(_utf32beDecode(encoded));
    } else if (encoded) {
      const bytes = BufferUtils.fromUint32Iterable(
        encoded,
        ByteOrder.BIG_ENDIAN,
      );
      return RuneSequence.fromString(_utf32beDecode(bytes));
    }
    throw new TypeError("encoded");
  }

  //XXX options discardBom
  static fromUtf32leEncoded(encoded: RuneSequence.Encoded): RuneSequence {
    if ((encoded instanceof ArrayBuffer) || ArrayBuffer.isView(encoded)) {
      return RuneSequence.fromString(_utf32leDecode(encoded));
    } else if (encoded) {
      const bytes = BufferUtils.fromUint32Iterable(
        encoded,
        ByteOrder.LITTLE_ENDIAN,
      );
      return RuneSequence.fromString(_utf32leDecode(bytes));
    }
    throw new TypeError("encoded");
  }

  //XXX fromUtf32Encoded

  clone(): RuneSequence {
    return new RuneSequence(this.toRunes());
  }

  toString(): string {
    return this.toRuneStrings().join(StringEx.EMPTY);
  }

  toRuneStrings(): Array<string> {
    return this.#runes.map((rune) => rune.toString());
  }

  toRunes(): Array<Rune> {
    return this.#runes.map((rune) => rune.clone());
  }

  //XXX options discardBom
  toUtf8Encoded(): Uint8Array {
    return _utf8Encode(this.toString());
  }

  toCodePoints(): Array<CodePoint> {
    return this.#runes.map((rune) => rune.toCodePoint());
  }

  toCharCodes(): Array<[Uint16] | [Uint16, Uint16]> {
    return this.#runes.map((rune) => rune.toCharCodes());
  }
}

export namespace RuneSequence {
  export type Encoded = BufferSource | Iterable<number>;
}
