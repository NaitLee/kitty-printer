import { createRef } from "preact";
import { _ } from "../common/i18n.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { NavProps } from "../common/types.ts";
import { useState } from "preact/hooks";

export default function NavBar(props: NavProps) {
    const [show, set_show] = useState(false);
    const url = new URL(props.url);
    return <>
        <nav class="nav">
            <div class="nav-title">
                <img class="title__logo" src="kitty.svg" alt={_('kitty-printer-app-logo-a-blue-kitty')} width={36} height={36} />
                <h1 class="title__header">{_('kitty-printer')}</h1>
                <span class="title__tag">{_('version^alpha')}</span>
            </div>
            <div class="nav-links">
                <a class="nav-links__link" href="javascript:" data-key="a" onClick={() => set_show(!show)}>{_('about')}</a>
            </div>
        </nav>
        <div class={"about" + (show ? ' about--visible' : '')}>
            <h2>{_('kitty-printer')}</h2>
            <p>{_('web-app-for-bluetooth-kitty-printers')}</p>
            <p>
                <a class="inline-link" href="https://github.com/NaitLee/kitty-printer" target="_blank" data-key={show ? "s" : undefined}>{_('check-source-code')}</a>
                <a href="https://fresh.deno.dev" class="fresh-logo" data-key={show ? "f" : undefined}>
                    <img
                        width="197"
                        height="37"
                        src="https://fresh.deno.dev/fresh-badge.svg"
                        alt="Made with Fresh"
                        loading="lazy"
                        async={true}
                    />
                </a>
            </p>
        </div>
        <noscript>
            <p class="noscript">
                <span>{_('this-application-requires-javascript-to-operate')}</span>
                <a class="inline-link" href="https://github.com/NaitLee/kitty-printer" target="_blank">{_('check-source-code')}</a>
            </p>
        </noscript>
        {IS_BROWSER && !('bluetooth' in navigator)
            ? <p class="nobluetooth">
                <span>{_('attention-your-browser-doesnt-have-bluetooth-support')}</span>
            </p> : <></>
        }
    </>;
}
