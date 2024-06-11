import { RuneSequence } from "./rune_sequence.ts";

export class GraphemeCluster {
  //readonly #runes: RuneSequence;
  readonly #locale?: Intl.Locale;

  //TODO
  // - クラスタ数が1でなければエラー
  // - normalize(NFC,NFD,...)してGraphemeCluster単位に分割したRuneSequenceの配列に変換
  // - GraphemeCluster単位に分割したRuneSequenceの配列に変換
  // - VSの除去、付加
  // - 接合子での分割、結合
  // -
}
