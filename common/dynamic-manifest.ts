
import { _ } from "./i18n.tsx";

export function manifest() {
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
            "sizes": "1024x1024",
            "type": "image/png"
        }]
    };
}
