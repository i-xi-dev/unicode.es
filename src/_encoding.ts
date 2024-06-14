import { Utf16 } from "./utf16.ts";
import { Utf32 } from "./utf32.ts";

/** @internal */
export namespace _Utf8 {
  let _decoder: WeakRef<TextDecoder>;

  export function decode(bytes: BufferSource): string {
    if (!_decoder?.deref()) {
      _decoder = new WeakRef(
        new TextDecoder("utf-8", { fatal: true }),
      );
    }
    return _decoder.deref()!.decode(bytes);
    // 孤立サロゲートがU+FFFDになるのは仕様
  }

  let _encoder: WeakRef<TextEncoder>;

  export function encode(str: string): Uint8Array {
    if (!_encoder?.deref()) {
      _encoder = new WeakRef(new TextEncoder());
    }
    return _encoder.deref()!.encode(str);
  }
}

/** @internal */
export namespace _Utf16be {
  let _decoder: WeakRef<TextDecoder>;

  export function decode(bytes: BufferSource): string {
    if (!_decoder?.deref()) {
      _decoder = new WeakRef(
        new TextDecoder("utf-16be", { fatal: true }),
      );
    }
    return _decoder.deref()!.decode(bytes);
  }

  let _encoder: WeakRef<Utf16.Be.Encoder>;

  export function encode(str: string): Uint8Array {
    if (!_encoder?.deref()) {
      _encoder = new WeakRef(
        new Utf16.Be.Encoder({ fatal: true }),
      );
    }
    return _encoder.deref()!.encode(str);
  }
}

/** @internal */
export namespace _Utf16le {
  let _decoder: WeakRef<TextDecoder>;

  export function decode(bytes: BufferSource): string {
    if (!_decoder?.deref()) {
      _decoder = new WeakRef(
        new TextDecoder("utf-16le", { fatal: true }),
      );
    }
    return _decoder.deref()!.decode(bytes);
  }

  let _encoder: WeakRef<Utf16.Le.Encoder>;

  export function encode(str: string): Uint8Array {
    if (!_encoder?.deref()) {
      _encoder = new WeakRef(
        new Utf16.Le.Encoder({ fatal: true }),
      );
    }
    return _encoder.deref()!.encode(str);
  }
}

/** @internal */
export namespace _Utf32be {
  let _decoder: WeakRef<Utf32.Be.Decoder>;

  export function decode(bytes: BufferSource): string {
    if (!_decoder?.deref()) {
      _decoder = new WeakRef(
        new Utf32.Be.Decoder({ fatal: true }),
      );
    }
    return _decoder.deref()!.decode(bytes);
  }

  let _encoder: WeakRef<Utf32.Be.Encoder>;

  export function encode(str: string): Uint8Array {
    if (!_encoder?.deref()) {
      _encoder = new WeakRef(
        new Utf32.Be.Encoder({ fatal: true }),
      );
    }
    return _encoder.deref()!.encode(str);
  }
}

/** @internal */
export namespace _Utf32le {
  let _decoder: WeakRef<Utf32.Be.Decoder>;

  export function decode(bytes: BufferSource): string {
    if (!_decoder?.deref()) {
      _decoder = new WeakRef(
        new Utf32.Le.Decoder({ fatal: true }),
      );
    }
    return _decoder.deref()!.decode(bytes);
  }

  let _encoder: WeakRef<Utf32.Le.Encoder>;

  export function encode(str: string): Uint8Array {
    if (!_encoder?.deref()) {
      _encoder = new WeakRef(
        new Utf32.Le.Encoder({ fatal: true }),
      );
    }
    return _encoder.deref()!.encode(str);
  }
}
