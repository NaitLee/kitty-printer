import { Head } from "$fresh/runtime.ts";
import KittyCanvas from "../islands/KittyCanvas.tsx";
import { _ } from "../common/i18n.tsx";
import Nav from "../islands/Nav.tsx";

export { handler } from "../common/i18n.tsx";

export default function Home(request: Request) {
    return <>
        <Head>
            <title>{_('kitty-printer')}</title>
        </Head>
        <Nav url={request.url} />
        <KittyCanvas />
    </>;
}
