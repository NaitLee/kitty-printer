
function rgbaToGray(rgba, brightness, alpha_as_white) {
    // use clamped array to prevent obscure bugs
    const mono = new Uint8ClampedArray(rgba.length);
    let r = 0.0, g = 0.0, b = 0.0, a = 0.0, m = 0.0, n = 0;
    for (let i = 0; i < mono.length; ++i) {
        n = rgba[i];
        // little endian
        r = (n & 0xff), g = (n >> 8 & 0xff), b = (n >> 16 & 0xff);
        a = (n >> 24 & 0xff) / 0xff;
        if (a < 1 && alpha_as_white) {
            a = 1 - a;
            r += (0xff - r) * a;
            g += (0xff - g) * a;
            b += (0xff - b) * a;
        } else { r *= a; g *= a; b *= a; }
        m = r * 0.2125 + g * 0.7154 + b * 0.0721;
        m += (brightness - 0x80) * (1 - m / 0xff) * (m / 0xff) * 2;
        mono[i] = m;
    }
    return mono;
}

function grayToRgba(mono, white_as_transparent) {
    const rgba = new Uint32Array(mono.length);
    for (let i = 0; i < mono.length; ++i) {
        const base = (mono[i] === 0xff && white_as_transparent) ? 0 : 0xff000000;
        // little endian
        rgba[i] = base | (mono[i] << 16) | (mono[i] << 8) | mono[i];
    }
    return rgba;
}

function ditherThreshold(mono, _w, _h) {
    for (let i = 0; i < mono.length; ++i) {
        mono[i] = mono[i] > 0x80 ? 0xff : 0x00;
    }
    return mono;
}

function ditherSteinberg(mono, w, h) {
    let p = 0, m, n, o;
    for(let j = 0; j < h; ++j){
        for(let i = 0; i < w; ++i){
            m = mono[p];
            n = mono[p] > 0x80 ? 0xff : 0x00;
            o = m - n;
            mono[p] = n;
            if (i >= 0 && i < w - 1 && j >= 0 && j < h) mono[p + 1] += o * 7 / 16;
            if (i >= 1 && i < w && j >= 0 && j < h - 1) mono[p + w - 1] += o * 3 / 16;
            if (i >= 0 && i < w && j >= 0 && j < h - 1) mono[p + w] += o * 5 / 16;
            if (i >= 0 && i < w - 1 && j >= 0 && j < h - 1) mono[p + w + 1] += o * 1 / 16;
            ++p;
        }
    }
    return mono;
}

function ditherHalftone(mono, w, h) {
    const spot = 4;
    const spot_h = spot / 2 + 1;
    // const spot_d = spot * 2;
    const spot_s = spot * spot;
    let i, j, x, y, o = 0.0;
    for (j = 0; j < h - spot; j += spot) {
        for (i = 0; i < w - spot; i += spot) {
            for (x = 0; x < spot; ++x)
                for (y = 0; y < spot; ++y)
                    o += mono[(j + y) * w + i + x];
            o = (1 - o / spot_s / 0xff) * spot;
            for (x = 0; x < spot; ++x)
                for (y = 0; y < spot; ++y) {
                    mono[(j + y) * w + i + x] = Math.abs(x - spot_h) >= o || Math.abs(y - spot_h) >= o ? 0xff : 0x00;
                    // mono[(j + y) * w + i + x] = Math.abs(x - spot_h) + Math.abs(y - spot_h) >= o ? 0xff : 0x00;
                }
        }
        for (; i < w; ++i) mono[j * w + i] = 0xff;
    }
    for (; j < h; ++j)
        for (i = 0; i < w; ++i) mono[j * w + i] = 0xff;
    return mono;
}

function rotate(before, w, h, turn) {
    const after = new Uint8Array(before.length);
    switch (turn) {
        case 0:
            return before;
        case 90:
            for (let j = 0; j < h; j++) {
                for (let i = 0; i < w; i++) {
                    after[j * w + i] = before[(w - i - 1) * h + j];
                }
            }
            break;
        case 180:
            for (let j = 0; j < h; j++) {
                for (let i = 0; i < w; i++) {
                    after[j * w + i] = before[(h - j - 1) * w + (w - i - 1)];
                }
            }
            break;
        case 270:
            for (let j = 0; j < h; j++) {
                for (let i = 0; i < w; i++) {
                    after[j * w + i] = before[i * h + (h - j - 1)];
                }
            }
            break;
    }
    return after;
}

function flip(before, w, h, mode) {
    const after = new Uint8Array(before.length);
    switch (mode) {
        case 'none':
            return before;
        case 'h':
            for (let j = 0; j < h; j++) {
                for (let i = 0; i < w; i++) {
                    after[j * w + i] = before[j * w + (w - i - 1)];
                }
            }
            break;
        case 'v':
            for (let j = 0; j < h; j++) {
                for (let i = 0; i < w; i++) {
                    after[j * w + i] = before[(h - j - 1) * w + i];
                }
            }
            break;
        case 'both':
            for (let j = 0; j < h; j++) {
                for (let i = 0; i < w; i++) {
                    after[j * w + i] = before[(h - j - 1) * w + (w - i - 1)];
                }
            }
            break;
    }
    return after;
}

self.addEventListener('message', function(event) {
    const msg = event.data;
    const input = new Uint32Array(msg.data);
    const w = msg.width, h = msg.height;
    let mono = rgbaToGray(input, msg.brightness, true);
    switch (msg.dither) {
        case 'pic':
            mono = ditherSteinberg(mono, w, h);
            break;
        case 'pattern':
            mono = ditherHalftone(mono, w, h);
            break;
        case 'text':
            mono = ditherThreshold(mono, w, h);
            break;
    }
    mono = flip(mono, w, h, msg.flip);
    if (msg.rotate === 0 || msg.rotate === 180)
        mono = rotate(mono, w, h, msg.rotate);
    else
        mono = rotate(mono, h, w, msg.rotate);
    const out = grayToRgba(mono, true).buffer;
    if (msg.rotate === 0 || msg.rotate === 180)
        self.postMessage({
            id: msg.id,
            data: out,
            width: w,
            height: h
        });
    else
        self.postMessage({
            id: msg.id,
            data: out,
            width: h,
            height: w
        });
});
