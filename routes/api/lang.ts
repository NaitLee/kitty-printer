import { LANGDIR, STATICDIR } from "../../common/constants.ts";

export const handler = async function(request: Request) {
    const url = new URL(request.url);
    const langs = url.searchParams.get('langs');
    const langlist: Record<string, string> = {};
    if (langs) {
        for (const lang of langs.split(',')) {
            await fetch(new URL(`../../${STATICDIR}/${LANGDIR}/${lang}.json`, import.meta.url)).then(r => r.text()).then(text => langlist[lang] = text).catch(error => void error);
        }
    }
    const response = '{' + Object.entries(langlist).map(([lang, json]) => `"${lang}":${json}`).join(',') + '}';
    return new Response(response, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
