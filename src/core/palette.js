/**
 * Color Palette Generation using Median Cut Algorithm
 */

import { findClosestPaletteColor } from '../utils/helpers.js';

/**
 * Generate a color palette from image data using median cut algorithm
 * @param {Uint8ClampedArray} pixelDataArray - Flat RGBA pixel data
 * @param {number} numColors - Number of colors to generate (1-256)
 * @returns {Array<Array<number>>} Array of [r, g, b] colors
 */
export function generatePalette(pixelDataArray, numColors) {
    numColors = Math.max(1, Math.min(256, Math.floor(numColors)));

    const allPixels = [];
    for (let i = 0; i < pixelDataArray.length; i += 4) {
        // Consider only opaque pixels for palette generation
        if (pixelDataArray[i + 3] > 128) {
            allPixels.push([pixelDataArray[i], pixelDataArray[i + 1], pixelDataArray[i + 2]]);
        }
    }

    // Handle edge case: no suitable pixels found
    if (allPixels.length === 0) {
        console.warn("No opaque pixels found for palette generation. Returning default palette.");
        const fallbackPalette = [];
        for (let i = 0; i < numColors; i++) {
            const shade = Math.floor(i * (255 / (numColors - 1 || 1)));
            fallbackPalette.push([shade, shade, shade]);
        }
        return fallbackPalette;
    }

    // Optimization: Use a subset of pixels if the image is very large
    const MAX_PIXELS_FOR_PALETTE_GENERATION = 65536;
    let pixelsToProcess;

    if (allPixels.length > MAX_PIXELS_FOR_PALETTE_GENERATION) {
        pixelsToProcess = [];
        const step = Math.max(1, Math.floor(allPixels.length / MAX_PIXELS_FOR_PALETTE_GENERATION));
        for (let i = 0; i < allPixels.length; i += step) {
            pixelsToProcess.push(allPixels[i]);
            if (pixelsToProcess.length >= MAX_PIXELS_FOR_PALETTE_GENERATION) break;
        }
    } else {
        pixelsToProcess = allPixels;
    }

    if (pixelsToProcess.length === 0) {
        console.warn("Pixel sampling resulted in empty set. Using first pixel.");
        pixelsToProcess = [allPixels[0]];
    }

    // --- Median Cut Algorithm ---
    let initialBucket = [...pixelsToProcess];
    let buckets = [initialBucket];

    // Split buckets until we have numColors or no more useful splits
    while (buckets.length < numColors && buckets.some(b => b && b.length > 1)) {
        let bestBucketIndex = -1;
        let maxRange = -1;
        let splitDimension = -1; // 0=R, 1=G, 2=B

        // Find the bucket with the largest range in one color dimension
        for (let i = 0; i < buckets.length; i++) {
            if (!buckets[i] || buckets[i].length <= 1) continue;

            let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
            buckets[i].forEach(p => {
                minR = Math.min(minR, p[0]); maxR = Math.max(maxR, p[0]);
                minG = Math.min(minG, p[1]); maxG = Math.max(maxG, p[1]);
                minB = Math.min(minB, p[2]); maxB = Math.max(maxB, p[2]);
            });
            const dR = maxR - minR;
            const dG = maxG - minG;
            const dB = maxB - minB;

            if (dR > maxRange) { maxRange = dR; bestBucketIndex = i; splitDimension = 0; }
            if (dG > maxRange) { maxRange = dG; bestBucketIndex = i; splitDimension = 1; }
            if (dB > maxRange) { maxRange = dB; bestBucketIndex = i; splitDimension = 2; }
        }

        // If no bucket can be split further
        if (bestBucketIndex === -1 || maxRange === 0) {
            break;
        }

        // Sort the chosen bucket along the widest dimension
        const bucketToSplit = buckets[bestBucketIndex];
        bucketToSplit.sort((a, b) => a[splitDimension] - b[splitDimension]);

        // Find the median index and split the bucket
        const medianIndex = Math.floor(bucketToSplit.length / 2);
        const newBucket1 = bucketToSplit.slice(0, medianIndex);
        const newBucket2 = bucketToSplit.slice(medianIndex);

        // Replace the original bucket with the two new buckets
        buckets.splice(bestBucketIndex, 1, newBucket1, newBucket2);
        buckets = buckets.filter(bucket => bucket && bucket.length > 0);
    }
    // --- End Median Cut ---

    // Create the palette by averaging colors in each final bucket
    const generatedPalette = buckets.map(bucket => {
        if (!bucket || bucket.length === 0) return [0, 0, 0];
        let r = 0, g = 0, b = 0;
        bucket.forEach(pixel => {
            r += pixel[0];
            g += pixel[1];
            b += pixel[2];
        });
        return [
            Math.round(r / bucket.length),
            Math.round(g / bucket.length),
            Math.round(b / bucket.length)
        ];
    });

    // Ensure the palette has exactly numColors
    while (generatedPalette.length < numColors && generatedPalette.length > 0) {
        generatedPalette.push([...generatedPalette[generatedPalette.length - 1]]);
    }
    if (generatedPalette.length > numColors) {
        generatedPalette.splice(numColors);
    }
    while (generatedPalette.length < numColors) {
        generatedPalette.push([0, 0, 0]);
    }

    return generatedPalette;
}

/**
 * Apply a color palette to image data
 * @param {Uint8ClampedArray} pixelDataArray - Source image data
 * @param {Array<Array<number>>} palette - Array of [r, g, b] colors
 * @returns {Uint8ClampedArray} Image data with palette applied
 */
export function applyPalette(pixelDataArray, palette) {
    if (!palette || palette.length === 0) {
        console.warn("Attempted to apply an empty or invalid palette.");
        return pixelDataArray;
    }

    const newData = new Uint8ClampedArray(pixelDataArray.length);
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

        const closestColor = findClosestPaletteColor(rOrig, gOrig, bOrig, palette);
        newData[i] = closestColor[0];
        newData[i + 1] = closestColor[1];
        newData[i + 2] = closestColor[2];
        newData[i + 3] = aOrig;
    }
    return newData;
}
