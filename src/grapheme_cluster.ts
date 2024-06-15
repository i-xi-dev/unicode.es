type _SegmentResult = {
  resolvedLocaleTag: string;
  graphemeClusters: Array<string>;
};

function _segment(str: string, segmenter: Intl.Segmenter): _SegmentResult {
  return {
    resolvedLocaleTag: segmenter.resolvedOptions().locale,
    graphemeClusters: [...segmenter.segment(str)].map((segment) =>
      segment.segment
    ),
  };
}

/** @internal */
export namespace _Segmenter {
  let _segmenter: WeakRef<Intl.Segmenter>;

  export function segment(str: string, localeTag: string): Array<string> {
    let segmenter: Intl.Segmenter;
    const prev = _segmenter?.deref();
    if (prev && (prev.resolvedOptions().locale === localeTag)) {
      segmenter = prev;
    } else {
      segmenter = new Intl.Segmenter(localeTag, { granularity: "grapheme" });
      const resolvedLocaleTag = segmenter.resolvedOptions().locale;
      if (resolvedLocaleTag !== localeTag) {
        throw new RangeError("localeTag");
      }
      _segmenter = new WeakRef(segmenter);
    }

    return _segment(str, segmenter).graphemeClusters;
  }
}

//XXX
// - VSの除去、付加
// - 接合子での分割、結合
// -
