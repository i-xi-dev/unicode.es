import { Utf16 } from "./utf16.ts";
import { Utf32 } from "./utf32.ts";

/** @internal */
export namespace _Utf8 {
  let _decoder: WeakRef<TextDecoder>;

  export function decode(bytes: BufferSource): string {
    let decoder: TextDecoder;
    const prev = _decoder?.deref();
    if (prev) {
      decoder = prev;
    } else {
      decoder = new TextDecoder("utf-8", { fatal: true }); // 孤立サロゲートはエラーにする
      _decoder = new WeakRef(decoder);
    }
    return decoder.decode(bytes);
  }

  let _encoder: WeakRef<TextEncoder>;

  export function encode(str: string): Uint8Array {
    let encoder: TextEncoder;
    const prev = _encoder?.deref();
    if (prev) {
      encoder = prev;
    } else {
      encoder = new TextEncoder(); // 孤立サロゲートはエラーにできないが、RuneSequenceにはそもそも孤立サロゲートは存在しない
      _encoder = new WeakRef(encoder);
    }
    return encoder.encode(str);
  }
}

/** @internal */
export namespace _Utf16be {
  let _decoder: WeakRef<TextDecoder>;

  export function decode(bytes: BufferSource): string {
    let decoder: TextDecoder;
    const prev = _decoder?.deref();
    if (prev) {
      decoder = prev;
    } else {
      decoder = new TextDecoder("utf-16be", { fatal: true }); // 孤立サロゲートはエラーにする
      _decoder = new WeakRef(decoder);
    }
    return decoder.decode(bytes);
  }

  let _encoder: WeakRef<Utf16.Be.Encoder>;

  export function encode(str: string): Uint8Array {
    let encoder: Utf16.Be.Encoder;
    const prev = _encoder?.deref();
    if (prev) {
      encoder = prev;
    } else {
      encoder = new Utf16.Be.Encoder({ fatal: true }); // 孤立サロゲートはエラーにする（RuneSequenceにはそもそも孤立サロゲートは存在しないので関係ないが）
      _encoder = new WeakRef(encoder);
    }
    return encoder.encode(str);
  }
}

/** @internal */
export namespace _Utf16le {
  let _decoder: WeakRef<TextDecoder>;

  export function decode(bytes: BufferSource): string {
    let decoder: TextDecoder;
    const prev = _decoder?.deref();
    if (prev) {
      decoder = prev;
    } else {
      decoder = new TextDecoder("utf-16le", { fatal: true }); // 孤立サロゲートはエラーにする
      _decoder = new WeakRef(decoder);
    }
    return decoder.decode(bytes);
  }

  let _encoder: WeakRef<Utf16.Le.Encoder>;

  export function encode(str: string): Uint8Array {
    let encoder: Utf16.Le.Encoder;
    const prev = _encoder?.deref();
    if (prev) {
      encoder = prev;
    } else {
      encoder = new Utf16.Le.Encoder({ fatal: true }); // 孤立サロゲートはエラーにする（RuneSequenceにはそもそも孤立サロゲートは存在しないので関係ないが）
      _encoder = new WeakRef(encoder);
    }
    return encoder.encode(str);
  }
}

/** @internal */
export namespace _Utf32be {
  let _decoder: WeakRef<Utf32.Be.Decoder>;

  export function decode(bytes: BufferSource): string {
    let decoder: Utf32.Be.Decoder;
    const prev = _decoder?.deref();
    if (prev) {
      decoder = prev;
    } else {
      decoder = new Utf32.Be.Decoder({ fatal: true }); // 孤立サロゲートはエラーにする
      _decoder = new WeakRef(decoder);
    }
    return decoder.decode(bytes);
  }

  let _encoder: WeakRef<Utf32.Be.Encoder>;

  export function encode(str: string): Uint8Array {
    let encoder: Utf32.Be.Encoder;
    const prev = _encoder?.deref();
    if (prev) {
      encoder = prev;
    } else {
      encoder = new Utf32.Be.Encoder({ fatal: true }); // 孤立サロゲートはエラーにする（RuneSequenceにはそもそも孤立サロゲートは存在しないので関係ないが）
      _encoder = new WeakRef(encoder);
    }
    return encoder.encode(str);
  }
}

/** @internal */
export namespace _Utf32le {
  let _decoder: WeakRef<Utf32.Le.Decoder>;

  export function decode(bytes: BufferSource): string {
    let decoder: Utf32.Le.Decoder;
    const prev = _decoder?.deref();
    if (prev) {
      decoder = prev;
    } else {
      decoder = new Utf32.Le.Decoder({ fatal: true }); // 孤立サロゲートはエラーにする
      _decoder = new WeakRef(decoder);
    }
    return decoder.decode(bytes);
  }

  let _encoder: WeakRef<Utf32.Le.Encoder>;

  export function encode(str: string): Uint8Array {
    let encoder: Utf32.Le.Encoder;
    const prev = _encoder?.deref();
    if (prev) {
      encoder = prev;
    } else {
      encoder = new Utf32.Le.Encoder({ fatal: true }); // 孤立サロゲートはエラーにする（RuneSequenceにはそもそも孤立サロゲートは存在しないので関係ないが）
      _encoder = new WeakRef(encoder);
    }
    return encoder.encode(str);
  }
}
