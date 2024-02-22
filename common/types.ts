import type { Dispatch } from "preact/hooks";
import type { Icons } from "./icons.tsx";

export type IconKey = keyof typeof Icons;

export interface StuffData {
    type: 'void' | 'text' | 'hr' | 'border' | 'pic' | 'gap' | 'qrcode';
    id: number;

    /* given after painting */
    width?: number;
    /* given after painting */
    height?: number;

    /* TODO: better way than such a trigger? */
    triggerPaste?: boolean;

    dither?: 'pic' | 'pattern' | 'text';
    rotate?: 0 | 90 | 180 | 270;
    flipH?: boolean;
    flipV?: boolean;
    brightness?: number;
    offset?: number;

    textContent?: string;
    textAlign?: 'start' | 'end' | 'center' | 'justify';
    textFontFamily?: string;
    textFontSize?: number;
    textLineSpacing?: number;
    textStroked?: boolean;
    textFontWeight?: '' | 'normal' | 'bold';
    textShift?: number;

    hrPadding?: number;
    hrStroke?: number;
    hrDash?: string;

    borderType?: 'simple' | 'grid';
    borderStroke?: number;
    borderGridUrl?: string;

    picUrl?: string;
    picScale?: number;

    gapHeight?: number;
    gapFill?: 'blank' | 'solid';
}

export interface StuffProps {
    dispatch: Dispatch<StuffUpdate>;
    stuff: StuffData;
}

export interface StuffUpdate {
    action: 'add' | 'modify' | 'remove' | 'moveup' | 'movedown';
    stuff: StuffData;
}

export interface KittyPrinterProps {}

export interface StuffPainterProps {
    stuff: StuffData;
    index: number;
    dispatch: Dispatch<BitmapData>;
    width: number;
    max_height?: number;
}

export interface ImageWorkerMessage {
    id: number;
    dither: 'pic' | 'pattern' | 'text';
    rotate: 0 | 90 | 180 | 270;
    flip: 'none' | 'h' | 'v' | 'both';
    brightness: number;
    data: ArrayBuffer;
    width: number;
    height: number;
}

export interface PrinterProps {
    stuffs: StuffData[];
}

export interface BitmapData {
    index: number;
    width: number;
    height: number;
    data: Uint8Array;
}

export interface NavProps {
    url: string;
}
