import { Head } from "$fresh/runtime.ts";
import KittyPrinter from "../islands/KittyPrinter.tsx";
import { _ } from "../common/i18n.tsx";
import Nav from "../islands/Nav.tsx";
import PwaUpdate from "../islands/PwaUpdate.tsx";
import DynamicManifest from "../islands/DynamicManifest.tsx";

export { handler } from "../common/i18n.tsx";

export default function Home(request: Request) {
    return <>
        <Head>
            <title>{_('kitty-printer')}</title>
			{/* TODO: a service worker */}
			{/* <PwaUpdate /> */}
        </Head>
		<DynamicManifest />
        <Nav url={request.url} />
        <KittyPrinter />
    </>;
}
