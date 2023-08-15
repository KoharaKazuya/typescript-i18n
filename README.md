# `@koharakazuya/typescript-i18n`

国際化対応 (i18n) するとき TypeScript においてシンプルかつ便利な方法を提供する npm パッケージ。

## 特徴

- 翻訳データは非プログラマが扱うこともあるので JSON のような単純な形式で定義できる
- 翻訳データの構造、パラメーターについて TypeScript の型推論機能で抜け漏れのチェックや自動補完ができる
- 翻訳データの各項目は使用箇所を追跡できる

## インストール

```console
$ npm install @koharakazuya/typescript-i18n
```

前提として TypeScript 最新バージョン、Compiler Option の `strict: true` 環境を想定しています。

## 使い方

サンプル

```typescript
import {
  checkSchemaParams,
  i18n,
  type Dictionary,
  type DictionarySchema,
} from "@koharakazuya/typescript-i18n";

// 翻訳データは `{ system: { title: "タイトル" } }` のように JSON のような形式で
// 構造で定義します。末端が文字列となっていれば自由にネストできます。
// また、`"年齢は{{age}}です。"` のように `{{変数名}}` で変数を埋め込むことができます。
// ここでは翻訳データの構造を定義します。データの構造とパラメーターについて定義してください。
// `extends DictionarySchema` は必須です。
interface MyDictionarySchema extends DictionarySchema {
  title: { brand: string; year: number };
  message: {
    submit: {};
    error: { amount: number };
    ok: {
      alert: {};
    };
  };
}

// 各言語ごとの翻訳データを定義します。翻訳データの構造に沿って定義してください。
// 変数自体に型は宣言せず、`as const satisfies Dictionary<MyDictionarySchema>`
// をつけなければならないことに注意してください。
const ja = {
  title: "{{brand}} from {{year}}",
  message: {
    submit: "送信しました",
    error: "エラーが発生しました: {{amount}}",
    ok: { alert: "OK" },
  },
} as const satisfies Dictionary<MyDictionarySchema>;
// 翻訳データ中で使ったパラメーターがデータ構造中に存在するかチェックします。
// 不足しているとコンパイルエラーになります。関数の中身は空なので実行時は何も実行しません。
checkSchemaParams<typeof ja, MyDictionarySchema>();

// 各言語ごとに翻訳関数を定義します。
const t = i18n<MyDictionarySchema>(ja);

// 翻訳関数を使って翻訳した文字列を取得します。
// どのデータを使用するか第一引数で指定します。このときエディタの補完機能が使えます。
// また、間違ったデータを指定した場合はコンパイルエラーになります。
// 第二引数には翻訳データのパラメーターを指定します。同様にエディタの補完機能が使えます。
const s1 = t((x) => x.message.error, { amount: 100 });
const s2 = t((x) => x.message.submit, {});
const s3 = t((x) => x.title, { brand: "Example", year: 2023 });

console.log({ s1, s2, s3 });
```
