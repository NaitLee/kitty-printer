
import I18nx from "../i18nx/i18n.ts";
import { DEF_LANG, LANGDB, LANGDIR, STATICDIR } from "../common/constants.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Signal, signal } from "@preact/signals";
import { acceptsLanguages } from "$std/http/negotiation.ts";
import { Handlers } from "$fresh/server.ts";

export const i18n = new I18nx();
const records: {
    string: string,
    things: Thing | Things | undefined,
    record: Signal<string>
}[] = [];

let i18n_ready = false;
const i18n_event = new EventTarget();
i18n_event.addEventListener('ready', () => i18n_ready = true);

export function i18nReady(f: () => void) {
    if (i18n_ready) f();
    else i18n_event.addEventListener('ready', f);
}

if (!IS_BROWSER) {
    await fetch(new URL(`../${STATICDIR}/${LANGDIR}/${LANGDB}`, import.meta.url))
        .then(r => r.json())
        .then(db => Promise.all(Object.entries(db).map(pair => {
            const lang = pair[0];
            i18n.add(lang);
            return fetch(new URL(`../${STATICDIR}/${LANGDIR}/${lang}.json`, import.meta.url))
                .then(r => r.json()).then(data => i18n.update(lang, data));
        }))
    );
    i18n_event.dispatchEvent(new Event('ready'));
}

function mktranslate(): (string: string, things?: Thing | Things) => Signal<string> {
    if (IS_BROWSER) {
        const languages = (navigator.languages || [navigator.language]).concat(DEF_LANG);
        fetch('/api/lang?langs=' + languages.join(','))
            .then(response => response.json())
            .then((langlist: Record<string, I18nData>) => {
                Object.entries(langlist).forEach(pair => {
                    i18n.add(pair[0]);
                    i18n.append(pair[0]);
                    i18n.update(pair[0], pair[1]);
                });
                document.querySelector('html')!.lang = i18n.stack[0];
                records.forEach(record => {
                    record.record.value = i18n._(record.string, record.things);
                });
                i18n_event.dispatchEvent(new Event('ready'));
            });
    }
    return function (string, things) {
        const record = signal(i18n._(string, things));
        records.push({
            string,
            things,
            record
        });
        return record;
    };
}

export const _ = mktranslate();
export const __ = i18n._;

//@ts-ignore:
globalThis._ = __;
//@ts-ignore:
globalThis.i18n = __;

export function updateI18nFromRequest(request: Request) {
    i18n.reset();
    for (const lang of acceptsLanguages(request))
      if (Object.hasOwn(i18n.data, lang))
        i18n.append(lang);
}

export const handler: Handlers = {
    GET(request, context) {
        updateI18nFromRequest(request);
        return context.render();
    }
};
