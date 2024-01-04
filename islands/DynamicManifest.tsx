
import { useEffect } from "preact/hooks";
import { dynamicManifest } from "../common/dynamic-manifest.ts";
import { i18nReady } from "../common/i18n.tsx";

export default function DynamicManifest() {
    useEffect(() => {
        i18nReady(function () {
            const manifest = dynamicManifest();
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = manifest.theme_color;
            document.head.appendChild(meta);
            const link = document.createElement('link');
            link.rel = 'manifest';
            link.href = 'data:application/manifest+json,' + encodeURIComponent(JSON.stringify(manifest));
            document.head.appendChild(link);
        })
    });
    return <></>;
}
