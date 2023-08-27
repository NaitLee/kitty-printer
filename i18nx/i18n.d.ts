
type Thing = number | string;
type Things = Thing[];

// https://tc39.es/ecma402/#sec-pluralruleselect
type PluralKind = "zero" | "one" | "two" | "few" | "many" | "other";

type Variant = string | Record<string, Variants>;
type Variants = (string | Variant[]);

type I18nData = Record<string, Variants>;

type ExtensionReturns = {
    key?: string,
    thing?: Thing
} | string | undefined | false;
type Extension = (thing: Thing, variant: Variant) => ExtensionReturns;
