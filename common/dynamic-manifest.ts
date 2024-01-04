
import { _ } from "./i18n.tsx";

export function dynamicManifest() {
    // origin for url is needed for such generated inline manifest
    const origin = location ? location.origin : '';
    const is_dark_theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme_color = is_dark_theme ? '#202020' : '#fdfdfd';
    return {
        "name": _('kitty-printer'),
        "short_name": _("kitty-printer"),
        "theme_color": theme_color,
        "background_color": theme_color,
        "display": "standalone",
        "scope": origin + "/",
        "start_url": origin + "/",
        "orientation": "any",
        "icons": [{
            "src": origin + "/kitty.png",
            "sizes": "32x32 48x48 72x72 96x96 128x128 256x256 512x512 1024x1024",
            "type": "image/png"
        }, {
            "src": origin + "/kitty-maskable.png",
            "sizes": "32x32 48x48 72x72 96x96 128x128 256x256 512x512 1024x1024",
            "type": "image/png",
            "purpose": "maskable"
        }],
        "screenshots": [{
            "src": origin + (is_dark_theme ? "/screenshots/narrow-dark.png" : "/screenshots/narrow.png"),
            "type": "image/png",
            "sizes": "720x1280",
            "form_factor": "narrow"
        }, {
            "src": origin + (is_dark_theme ? "/screenshots/wide-dark.png" : "/screenshots/wide.png"),
            "type": "image/jpg",
            "sizes": "1280x720",
            "form_factor": "wide"
        }]
    };
}
