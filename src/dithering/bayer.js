/**
 * Bayer Dithering Algorithm
 * Ordered dithering using predefined Bayer matrices
 */

import { findClosestPaletteColor } from '../utils/helpers.js';

/**
 * Bayer matrices for different dithering intensities
 */
const BAYER_MATRICES = {
    '2x2': [
        [0, 2],
        [3, 1]
    ],
    '4x4': [
        [0,  8,  2, 10],
        [12, 4, 14,  6],
        [3, 11,  1,  9],
        [15, 7, 13,  5]
    ],
    '8x8': [
        [ 0, 32,  8, 40,  2, 34, 10, 42],
        [48, 16, 56, 24, 50, 18, 58, 26],
        [12, 44,  4, 36, 14, 46,  6, 38],
        [60, 28, 52, 20, 62, 30, 54, 22],
        [ 3, 35, 11, 43,  1, 33,  9, 41],
        [51, 19, 59, 27, 49, 17, 57, 25],
        [15, 47,  7, 39, 13, 45,  5, 37],
        [63, 31, 55, 23, 61, 29, 53, 21]
    ]
};

/**
 * Apply Bayer dithering to image data
 * @param {Uint8ClampedArray} pixelDataArray - Source image data
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {Array<Array<number>>} targetPalette - Target color palette
 * @param {number} strengthPercent - Dither strength (0-100)
 * @returns {Uint8ClampedArray} Dithered image data
 */
export function applyBayerDithering(pixelDataArray, width, height, targetPalette, strengthPercent = 100) {
    if (!targetPalette || targetPalette.length === 0) {
        console.warn("Bayer dithering called with empty or invalid palette.");
        return pixelDataArray;
    }
    if (!pixelDataArray || !pixelDataArray.length) return pixelDataArray;

    const newData = new Uint8ClampedArray(pixelDataArray.length);
    strengthPercent = Math.max(0, Math.min(100, strengthPercent));

    // If strength is 0, just apply palette without dithering
    if (strengthPercent === 0) {
        for (let i = 0; i < pixelDataArray.length; i += 4) {
            const aOrig = pixelDataArray[i + 3];
            if (aOrig === 0) {
                newData[i] = 0;
                newData[i + 1] = 0;
                newData[i + 2] = 0;
                newData[i + 3] = 0;
                continue;
            }
            const rOrig = pixelDataArray[i];
            const gOrig = pixelDataArray[i + 1];
            const bOrig = pixelDataArray[i + 2];
            const closestColor = findClosestPaletteColor(rOrig, gOrig, bOrig, targetPalette);
            newData[i] = closestColor[0];
            newData[i + 1] = closestColor[1];
            newData[i + 2] = closestColor[2];
            newData[i + 3] = aOrig;
        }
        return newData;
    }

    const strengthFactor = strengthPercent / 100.0;

    let bayerMatrix;
    let matrixSize;

    // Determine matrix based on strength
    if (strengthPercent <= 33.3) {
        bayerMatrix = BAYER_MATRICES['2x2'];
        matrixSize = 2;
    } else if (strengthPercent <= 66.6) {
        bayerMatrix = BAYER_MATRICES['4x4'];
        matrixSize = 4;
    } else {
        bayerMatrix = BAYER_MATRICES['8x8'];
        matrixSize = 8;
    }

    const bayerValueNormalization = 1.0 / (matrixSize * matrixSize);
    const maxThresholdOffset = (strengthFactor * matrixSize * matrixSize / 2);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const rOrig = pixelDataArray[i];
            const gOrig = pixelDataArray[i + 1];
            const bOrig = pixelDataArray[i + 2];
            const aOrig = pixelDataArray[i + 3];

            if (aOrig === 0) {
                newData[i] = 0;
                newData[i + 1] = 0;
                newData[i + 2] = 0;
                newData[i + 3] = 0;
                continue;
            }

            const bayerPatternValue = bayerMatrix[y % matrixSize][x % matrixSize];
            const thresholdAdjustment = (bayerPatternValue * bayerValueNormalization - 0.5) * maxThresholdOffset;

            const rDithered = Math.max(0, Math.min(255, rOrig + thresholdAdjustment));
            const gDithered = Math.max(0, Math.min(255, gOrig + thresholdAdjustment));
            const bDithered = Math.max(0, Math.min(255, bOrig + thresholdAdjustment));

            const closestColor = findClosestPaletteColor(rDithered, gDithered, bDithered, targetPalette);

            newData[i] = closestColor[0];
            newData[i + 1] = closestColor[1];
            newData[i + 2] = closestColor[2];
            newData[i + 3] = aOrig;
        }
    }
    return newData;
}
