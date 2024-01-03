
export function mkcanvas(width: number) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    const img = document.createElement('img');
    const ctx = canvas.getContext('2d')!;
    return { canvas, width, img, ctx };
}

export function round_to(n: number, d: number) {
    return Math.round(n * (10 * d)) / (10 * d);
}
