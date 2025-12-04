/**
 * Color Space Conversion Utilities
 * Provides RGB ↔ HSL conversion functions
 */

/**
 * Convert RGB color to HSL color space
 * @param {number} r - Red channel (0-255)
 * @param {number} g - Green channel (0-255)
 * @param {number} b - Blue channel (0-255)
 * @returns {Array<number>} [h, s, l] where h, s, l are in range [0, 1]
 */
export function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

/**
 * Convert HSL color to RGB color space
 * @param {number} h - Hue (0-1)
 * @param {number} s - Saturation (0-1)
 * @param {number} l - Lightness (0-1)
 * @returns {Array<number>} [r, g, b] where r, g, b are in range [0, 255]
 */
export function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Apply hue shift to RGB color
 * @param {Uint8ClampedArray} data - Image data array
 * @param {number} angle - Hue rotation angle in degrees (-180 to 180)
 * @returns {Uint8ClampedArray} Modified image data
 */
export function applyHueShift(data, angle) {
    const shift = angle / 360;
    for (let i = 0; i < data.length; i += 4) {
        let [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
        h = (h + shift) % 1.0;
        if (h < 0) h += 1.0;
        const [rVal, gVal, bVal] = hslToRgb(h, s, l);
        data[i] = rVal;
        data[i + 1] = gVal;
        data[i + 2] = bVal;
    }
    return data;
}
