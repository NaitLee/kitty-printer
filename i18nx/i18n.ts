
///<reference path="./i18n.d.ts" />

import { CommonExtensionsByLanguage } from "./common-extensions.ts";

/** Make a plural selector Extension for this language */
function mkpluralext(lang: string) {
    const rule = typeof Intl === 'undefined' ? undefined : new Intl.PluralRules(lang);
    return function(thing: Thing, v: Variant) {
        if (typeof thing !== 'number' || typeof v !== 'object' || !Object.hasOwn(v, 'one'))
            return undefined;
        if (rule === undefined)
            return thing === 1 ? 'one' : 'other';
        else
            return rule.select(thing);
    }
}
/** Make a number formatter Extension for this language */
function mknumberfmtext(lang: string) {
    if (typeof Intl === 'undefined')
        return () => undefined;
    const formatter = new Intl.NumberFormat(lang);
    return function(thing: Thing, _v: Variant) {
        if (typeof thing !== 'number') return undefined;
        return { thing: formatter.format(thing) };
    }
}

/**
 * I18nx: I18n, Extensible
 */
export default class I18nx {
    /** I18n data so far by language */
    public data: Record<string, I18nData>;
    /** Language priority list */
    public stack: string[];
    /** Existing Extensions by language */
    public extensions: Record<string, Extension[]>;
    /**
     * Initialize i18nx class
     * @param use_preset_exts There are some extensions built in: plural rules, number representation, etc. Use `true` to enable them, which is the default.
     */
    constructor(public use_preset_exts: boolean = true) {
        this.data = {};
        this.stack = [];
        this.extensions = {};
    }
    /**
     * Don’t use this language (primarily or as fallback) anymore. Existing i18n data is untouched.
     * @param lang Language code
     */
    remove(lang: string) {
        for (let i = 0; i < this.stack.length; i++)
            if (this.stack[i] === lang)
                this.stack.splice(i, 1);
    }
    /**
     * Initialize this language. Do this before updating/extending/using it.
     * @param lang Language code
     */
    add(lang: string) {
        this.data[lang] = {};
        const exts: Extension[] = this.extensions[lang] = [];
        const common_exts = CommonExtensionsByLanguage[lang];
        if (this.use_preset_exts) {
            exts.push(mkpluralext(lang));
            exts.push(mknumberfmtext(lang));
            if (common_exts)
                exts.push(...common_exts);
        }
    }
    /**
     * Put this language as a fallback. Useful for initializing languages from like `navigator.languages`
     * @param lang Language code
     */
    append(lang: string) {
        this.remove(lang);
        this.stack.push(lang);
    }
    /**
     * Put this language as the first to use. Useful for setting user language on demand.
     * @param lang Language code
     */
    prepend(lang: string) {
        this.remove(lang);
        this.stack.unshift(lang);
    }
    /**
     * Reset language preference stack.
     */
    reset() {
        this.stack.splice(0, this.stack.length);
    }
    /**
     * Add/Update i18n data for this language. Existing strings are overwritten.
     * @param lang Language code
     * @param data JavaScript Object for i18n data
     */
    update(lang: string, data: I18nData) {
        if (!lang) lang = this.stack[0];
        for (const key in data)
            this.data[lang][key] = data[key];
    }
    /**
     * Add a function for this language as an Extension. With highest priority.
     * @param lang Language code
     * @param ext An Extension
     */
    extend(lang: string, ext: Extension) {
        if (!lang) lang = this.stack[0];
        this.extensions[lang].unshift(ext);
    }
    /**
     * Translate a string to certain language by priority with existing data.
     * @param string string to be translated
     * @param things arguments, number or string, singular or many in a list
     * @returns translated string
     */
    translate(string: string, things?: Thing | Things): string {
        let language: string | undefined;
        let variants: Variants | undefined;
        for (const lang of this.stack)
            if (this.data[lang] !== undefined && this.data[lang][string] !== undefined) {
                language = lang;
                variants = this.data[lang][string];
                break;
            }
        if (language === undefined || variants === undefined)
            return string;
        if (typeof variants === 'string' && things === undefined)
            return variants;
        if (typeof things === 'undefined')
            things = [];
        else if (typeof things === 'number' || typeof things === 'string')
            things = [things];
        const holdplace = (s: string, i: number, p: string) => s.replace(i === -1 ? '{}' : `{${i}}`, p);
        if (typeof variants === 'string')
            return things.map((thing, i) => variants = holdplace(variants as string, i, thing.toString())), variants;
        const apply_variants: (v: Variant, t: Thing, i: number) => string
            = (v: Variant, t: Thing, i: number) => {
                if (typeof v === 'string')
                    return holdplace(v, i, t.toString());
                else {
                    let extresult: ExtensionReturns;
                    let k: string | undefined;
                    let m: Thing | undefined;
                    for (const ext of this.extensions[language!])
                        if ((extresult = ext(m || t, v))) {
                            if (typeof extresult === 'object') {
                                m = extresult.thing || m;
                                k = extresult.key || k;
                            }
                            else
                                k = extresult;
                            if (k !== undefined && m !== undefined)
                                break;
                        }
                    if (m === undefined) m = t;
                    if (k === undefined) return m.toString();
                    if (typeof v[k] === 'undefined')
                        return m.toString();
                    else if (typeof v[k] === 'string')
                        return holdplace(v[k] as string, -1, m.toString());
                    else
                        return holdplace(v[k][0] as string, -1, apply_variants(v[k][1], m, -1));
                }
            }
        let result = variants[0] as string;
        for (let i = 0; i < things.length; i++)
            result = holdplace(result, i, apply_variants(variants[i + 1], things[i], i));
        return result;
    }
    /** Shortcut for I18nx.translate */
    _ = this.translate.bind(this);
}
