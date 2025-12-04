/**
 * Floyd-Steinberg Dithering Algorithm
 * Error diffusion dithering for high-quality results
 */

import { findClosestPaletteColor } from '../utils/helpers.js';

/**
 * Apply Floyd-Steinberg error diffusion dithering
 * @param {Uint8ClampedArray} pixelDataArray - Source image data
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {Array<Array<number>>} targetPalette - Target color palette
 * @returns {Uint8ClampedArray} Dithered image data
 */
export function applyFloydSteinbergDithering(pixelDataArray, width, height, targetPalette) {
    if (!targetPalette || targetPalette.length === 0) {
        console.warn("Floyd-Steinberg dithering called with empty or invalid palette.");
        return pixelDataArray;
    }
    if (!pixelDataArray || !pixelDataArray.length) return pixelDataArray;

    // Create a mutable copy using Float32Array for error accumulation
    const d = new Float32Array(pixelDataArray.length);
    for (let k = 0; k < pixelDataArray.length; k++) d[k] = pixelDataArray[k];

    const outputData = new Uint8ClampedArray(pixelDataArray.length);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;

            if (d[i + 3] === 0) {
                outputData[i] = 0;
                outputData[i + 1] = 0;
                outputData[i + 2] = 0;
                outputData[i + 3] = 0;
                continue;
            }

            // Clamp current pixel values
            const oldR = Math.max(0, Math.min(255, d[i]));
            const oldG = Math.max(0, Math.min(255, d[i + 1]));
            const oldB = Math.max(0, Math.min(255, d[i + 2]));
            const oldA = d[i + 3];

            const newColor = findClosestPaletteColor(oldR, oldG, oldB, targetPalette);
            outputData[i] = newColor[0];
            outputData[i + 1] = newColor[1];
            outputData[i + 2] = newColor[2];
            outputData[i + 3] = Math.round(oldA);

            const errR = oldR - newColor[0];
            const errG = oldG - newColor[1];
            const errB = oldB - newColor[2];

            // Propagate error to neighbors
            let ni; // neighbor index

            // Pixel to the right: (x+1, y) - 7/16
            if (x + 1 < width) {
                ni = i + 4;
                d[ni]     += errR * 7 / 16;
                d[ni + 1] += errG * 7 / 16;
                d[ni + 2] += errB * 7 / 16;
            }
            // Pixel below and to the left: (x-1, y+1) - 3/16
            if (x - 1 >= 0 && y + 1 < height) {
                ni = i + (width * 4) - 4;
                d[ni]     += errR * 3 / 16;
                d[ni + 1] += errG * 3 / 16;
                d[ni + 2] += errB * 3 / 16;
            }
            // Pixel directly below: (x, y+1) - 5/16
            if (y + 1 < height) {
                ni = i + (width * 4);
                d[ni]     += errR * 5 / 16;
                d[ni + 1] += errG * 5 / 16;
                d[ni + 2] += errB * 5 / 16;
            }
            // Pixel below and to the right: (x+1, y+1) - 1/16
            if (x + 1 < width && y + 1 < height) {
                ni = i + (width * 4) + 4;
                d[ni]     += errR * 1 / 16;
                d[ni + 1] += errG * 1 / 16;
                d[ni + 2] += errB * 1 / 16;
            }
        }
    }
    return outputData;
}
