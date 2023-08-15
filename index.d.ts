export type TranslationParamType = string | number;
export type TranslationParams = Record<string, TranslationParamType>;
export type DictionarySchema = {
  [key: string]: TranslationParams | DictionarySchema;
};

export type Dictionary<Schema> = Schema extends TranslationParams
  ? string
  : { [K in keyof Schema]: Dictionary<Schema[K]> };

type TranslationParamSchema<T> = T extends `${infer _}{{${infer P}}}${infer U}`
  ? { [K in P]: TranslationParamType } & TranslationParamSchema<U>
  : {};
type SchemaParams<T> = {
  [K in keyof T]: T[K] extends string
    ? TranslationParamSchema<T[K]>
    : SchemaParams<T[K]>;
};
export function checkSchemaParams<T, U extends SchemaParams<T>>(): void;

declare const opaqueSymbol: unique symbol;
export type SelectorOption<T> = string & { readonly [opaqueSymbol]: T };
export type SelectorOptionTree<T> = T extends TranslationParams
  ? SelectorOption<T>
  : { [K in keyof T]: SelectorOptionTree<T[K]> };

export type Translator<T> = <U extends {}>(
  selector: (x: SelectorOptionTree<T>) => SelectorOption<U>,
  params: U
) => string;

export function i18n<T extends DictionarySchema>(
  dict: Dictionary<T>
): Translator<T>;
