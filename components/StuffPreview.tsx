import { useState } from "preact/hooks";
import { ImageWorkerMessage, StuffPainterProps } from "../common/types.ts";
import { mkcanvas } from "../common/utility.ts";
//@ts-ignore: outdated type annotation from cdn
import { splitText } from 'canvas-txt'
import { IS_BROWSER } from "$fresh/runtime.ts";
import { STUFF_PAINT_INIT_URL } from "../common/constants.ts";
import { _ } from "../common/i18n.tsx";

declare function splitText(args: {
    ctx: CanvasRenderingContext2D,
    text: string,
    justify?: boolean,
    width?: number
}): string[];

const image_worker = IS_BROWSER ? new Worker('/image_worker.js') : null;

export default function StuffPreview(props: StuffPainterProps) {
    const [imgsrc, set_imgsrc] = useState(STUFF_PAINT_INIT_URL);
    if (!IS_BROWSER) return <img src={STUFF_PAINT_INIT_URL} width={props.width} height={1} />;
    const { canvas, width, ctx, img } = mkcanvas(props.width);
    const stuff = props.stuff;
    let font;
    let strings: string[];
    let measured: TextMetrics[];
    let line_height;
    let msg: ImageWorkerMessage;
    let imagedata: ImageData;
    (async function() {
        switch (stuff.type) {
            case 'text':
                ctx.fillStyle = 'black';
                ctx.strokeStyle = 'black';
                font = `${stuff.textFontWeight} ${stuff.textFontSize}px "${stuff.textFontFamily}"`;
                // ctx.font is set multiple times intensionally
                ctx.font = font;
                const is_rotated_sideways = stuff.rotate === 90 || stuff.rotate === 270;
                strings = splitText({
                    ctx: ctx,
                    text: stuff.textContent!,
                    justify: stuff.textAlign === 'justify',
                    width: is_rotated_sideways ? 10000 : width
                });
                ctx.font = font;
                measured = strings.map(s => ctx.measureText(s));
                line_height = stuff.textLineSpacing! + Math.max(...measured.map(m => m.actualBoundingBoxAscent), stuff.textFontSize!);
                
                const text_intrinsic_height = line_height * strings.length + stuff.textLineSpacing!;

                const needs_flip = is_rotated_sideways
                    ? (stuff.rotate === 90) !== !!stuff.flipV
                    : (stuff.rotate === 180) !== !!stuff.flipH;

                let effectiveTextAlign = stuff.textAlign;
                if (needs_flip) {
                    if (stuff.textAlign === 'start') effectiveTextAlign = 'end';
                    else if (stuff.textAlign === 'end') effectiveTextAlign = 'start';
                }
                const shiftMultiplier = needs_flip ? -1 : 1;

                let y_offset = 0;

                if (is_rotated_sideways) {
                    const text_intrinsic_width = Math.max(...measured.map(m => m.width));
                    canvas.width = text_intrinsic_width > 0 ? text_intrinsic_width : 1;
                    canvas.height = width; // Use preview width for the height, which will be rotated to become the new width.

                    let h_align_offset = 0;
                    switch (effectiveTextAlign) {
                        case 'center':
                            h_align_offset = (canvas.height - text_intrinsic_height) / 2;
                            break;
                        case 'end':
                            h_align_offset = canvas.height - text_intrinsic_height;
                            break;
                    }
                    const h_shift_offset = shiftMultiplier * stuff.textShift! * canvas.height;
                    y_offset = h_align_offset + h_shift_offset;
                } else {
                    canvas.height = text_intrinsic_height > 0 ? text_intrinsic_height : 1;
                }

                ctx.font = font;
                ctx.fillStyle = 'black';
                ctx.strokeStyle = 'black';
                ctx.textAlign = 'start';
                for (let i = 0; i < strings.length; ++i) {
                    const s = strings[i];
                    let anchor_x;

                    if (is_rotated_sideways) {
                        const text_block_width = canvas.width;
                        anchor_x = ({
                            'start': 0,
                            'center': (text_block_width - measured[i].width) / 2,
                            'end': text_block_width - measured[i].width,
                            'justify': 0
                        })[stuff.textAlign!];
                    } else {
                        anchor_x = ({
                            'start': 0,
                            'center': (width - measured[i].width) / 2,
                            'end': width - measured[i].width,
                            'justify': 0
                        })[effectiveTextAlign] + (shiftMultiplier * stuff.textShift! * width);
                    }
                    
                    const anchor_y = y_offset + line_height * (i + 1);

                    if (stuff.textStroked) {
                        ctx.strokeText(s, anchor_x, anchor_y);
                    } else {
                        ctx.fillText(s, anchor_x, anchor_y);
                    }
                }
                break;
            case 'pic':
                img.src = stuff.picUrl!;
                await new Promise<void>(resolve =>
                    img.addEventListener('load', () => resolve(), { once: true }));
                if (stuff.rotate === 0 || stuff.rotate === 180) {
                    img.height = width / (img.width / img.height) | 0;
                    img.width = width;
                } else {
                    img.width = width * (img.width / img.height) | 0;
                    img.height = width;
                }
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                break;
        }
        image_worker!.postMessage({
            id: stuff.id,
            dither: stuff.dither,
            rotate: stuff.rotate,
            flip: stuff.flipH ? (stuff.flipV ? 'both' : 'h') : (stuff.flipV ? 'v' : 'none'),
            brightness: stuff.brightness,
            data: ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer,
            width: canvas.width,
            height: canvas.height
        })
        msg = await new Promise<ImageWorkerMessage>(resolve => {
            const callback = (event: MessageEvent<ImageWorkerMessage>) => {
                if (event.data.id !== stuff.id) return;
                // { once: true } doesn't work on this one
                image_worker!.removeEventListener('message', callback);
                resolve(event.data);
            };
            image_worker!.addEventListener('message', callback);
        });
        stuff.width = canvas.width = msg.width;
        stuff.height = canvas.height = msg.height;
        imagedata = new ImageData(new Uint8ClampedArray(msg.data), msg.width, msg.height);
        ctx.putImageData(imagedata, 0, 0);
        if (canvas.height !== 0) {
            const url = canvas.toDataURL();
            set_imgsrc(url);
            props.dispatch({
                index: props.index,
                width: canvas.width,
                height: canvas.height,
                data: new Uint8Array(imagedata.data.buffer)
            });
        }
    })();
    return <div class="kitty-preview__stuff-box" style={`height:${Math.max(stuff.height! + stuff.offset!, 0)}px;top:${stuff.offset!}px`}>
        <img key={stuff.id} class="kitty-preview__stuff" src={imgsrc} alt={_('preview-0', stuff.id)} width={width} height={canvas.height} />
    </div>;
}
