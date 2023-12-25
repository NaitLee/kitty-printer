import { Head } from "$fresh/runtime.ts";
import KittyCanvas from "../islands/KittyCanvas.tsx";
import { _ } from "../common/i18n.tsx";
import Nav from "../islands/Nav.tsx";

export { handler } from "../common/i18n.tsx";

export default function Home(request: Request) {
    return <>
        <Head>
            <title>{_('kitty-printer')}</title>
			<link
				crossorigin="use-credentials"
				rel="manifest"
				href="/manifest.json"
			/>
        </Head>
		<script type="module">
			import "https://cdn.jsdelivr.net/npm/@pwabuilder/pwaupdate/dist/pwa-update.js"; const
			el = document.createElement("pwa-update"); document.body.appendChild(el);
		</script>
        <Nav url={request.url} />
        <KittyCanvas />
    </>;
}
