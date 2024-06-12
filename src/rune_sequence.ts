import { BufferUtils, SafeInteger, StringEx, Uint16 } from "../deps.ts";
import { CodePoint } from "./code_point.ts";
import { Rune } from "./rune.ts";

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
  static fromUtf8Encoded(
    encoded: BufferSource | Iterable<number>,
  ): RuneSequence {
    if ((encoded instanceof ArrayBuffer) || ArrayBuffer.isView(encoded)) {
      return RuneSequence.fromString(_utf8Decode(encoded));
    } else if (encoded) {
      const bytes = BufferUtils.fromUint8Iterable(encoded);
      return RuneSequence.fromString(_utf8Decode(bytes));
    }
    throw new TypeError("source");
  }

  //XXX static fromUtf16beEncoded(encoded: BufferSource | Iterable<number>): RuneSequence {}

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

  //XXX toUtf8Encoded(): Uint8Array {}

  toCodePoints(): Array<CodePoint> {
    return this.#runes.map((rune) => rune.toCodePoint());
  }

  toCharCodes(): Array<[Uint16] | [Uint16, Uint16]> {
    return this.#runes.map((rune) => rune.toCharCodes());
  }
}
