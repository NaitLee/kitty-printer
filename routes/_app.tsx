import type { FreshContext } from "$fresh/server.ts";
// import { Head } from "$fresh/runtime.ts";
import { _, i18n } from "../common/i18n.tsx";
import { acceptsLanguages } from "$std/http/mod.ts";

// deno-lint-ignore require-await
export default async function App(req: Request, ctx: FreshContext) {
  i18n.reset();
  for (const lang of acceptsLanguages(req))
      if (Object.hasOwn(i18n.data, lang))
          i18n.append(lang);
  return (
    <html lang={i18n.stack[0]}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta icon="/kitty.svg" />
        <meta name="description" content={_('-meta-description')} />
        <link rel="stylesheet" href="/styles.css" />
        <title></title>
      </head>
      <body>
        <ctx.Component />
        <div id="keyboard-shortcuts-layer"></div>
        <script src="accessibility.js"></script>
      </body>
    </html>
  );
}
