import type { Dispatch } from "preact/hooks";
import type { Icons } from "./icons.tsx";

export type IconKey = keyof typeof Icons;

export interface StuffData {
    type: 'void' | 'text' | 'hr' | 'border' | 'pic';
    id: number;

    dither?: 'pic' | 'pattern' | 'text';
    rotate?: 0 | 90 | 180 | 270;
    flipH?: boolean;
    flipV?: boolean;
    brightness?: number;

    textContent?: string;
    textAlign?: 'start' | 'end' | 'center' | 'justify';
    textFontFamily?: string;
    textFontSize?: number;
    textLineSpacing?: number;
    textStroked?: boolean;
    textFontWeight?: '' | 'normal' | 'bold';
    textOffset?: number;

    hrPadding?: number;
    hrStroke?: number;
    hrDash?: string;

    borderType?: 'simple' | 'grid';
    borderStroke?: number;
    borderGridUrl?: string;

    picUrl?: string;
    picScale?: number;
}

export interface StuffProps {
    dispatch: Dispatch<StuffUpdate>;
    stuff: StuffData;
}

export interface StuffUpdate {
    action: 'add' | 'modify' | 'remove' | 'moveup' | 'movedown';
    stuff: StuffData;
}

export interface KittyCanvasProps {}

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
