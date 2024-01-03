// import "@pwabuilder/pwaupdate";

import { createElement } from "preact";

export default function PwaUpdate() {
    return <>
        <script
            type="module"
            async={true}
            src="https://esm.sh/@pwabuilder/pwaupdate"
        ></script>
        {createElement('pwa-update', {})}
    </>;
}
