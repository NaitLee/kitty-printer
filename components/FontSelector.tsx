import { useState } from "preact/hooks";
import { _ } from "../common/i18n.tsx";

declare interface FontData {
    family: string;
    fullName: string;
    postscriptName: string;
    style: string;
};
declare function queryLocalFonts(): Promise<FontData[]>;

export default function FontSelector(props: { class?: string, value: string, onChange: (event: Event) => void }) {
    const [font_loaded, set_font_loaded] = useState(false);
    const [fontlist, set_fontlist] = useState<FontData[]>([]);
    return 'queryLocalFonts' in self
        ? font_loaded
            ? <select {...props}>
                {['serif', 'sans-serif', 'monospace'].map(font => <option value={font}>{_(font)}</option>)}
                {fontlist.map(font => <option value={font.family} selected={font.family === props.value}>{font.fullName}</option>)}
            </select>
            : <button class={props.class} onClick={() => {
                queryLocalFonts().then(data => set_fontlist(data)).then(() => set_font_loaded(true));
            }}>{_('click-to-load-fonts')}</button>
        : <input type="text" {...props} />;
}
