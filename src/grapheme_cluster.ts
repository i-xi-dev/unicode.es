// type _SegmentResult = {
//   resolvedLocaleTag: string;
//   graphemeClusters: Array<string>;
// };

let _lastSegmenter: WeakRef<Intl.Segmenter>;

function _segment(str: string, localeTag: string): Array<string> {
  let segmenter: Intl.Segmenter;
  const prev = _lastSegmenter?.deref();
  if (prev && (prev.resolvedOptions().locale === localeTag)) {
    segmenter = prev;
  } else {
    segmenter = new Intl.Segmenter(localeTag, { granularity: "grapheme" });
    const resolvedLocaleTag = segmenter.resolvedOptions().locale;
    if (resolvedLocaleTag !== localeTag) {
      throw new RangeError("localeTag");
    }
    _lastSegmenter = new WeakRef(segmenter);
  }

  return [...segmenter.segment(str)].map((segment) => segment.segment);
}

export namespace GraphemeCluster {
  export function stringToGraphemeClusters(
    str: string,
    localeTag: string,
  ): Array<string> {
    return _segment(str, localeTag);
  }

  //TODO
  // - 不正なVSの除去
  //    - 連続している
  //    - 接合子で分解したとき先頭にある
  //    - 接合子で分解したとき未定義のシーケンスになる → これはさすがに実装したくない
  // - VSの除去、付加
  // - 接合子での分割、結合
  // - ・・・
}
