/**
 * Helper utility functions for image processing
 */

/**
 * Calculate squared Euclidean distance between two RGB colors
 * @param {number} r1 - Red channel of first color
 * @param {number} g1 - Green channel of first color
 * @param {number} b1 - Blue channel of first color
 * @param {number} r2 - Red channel of second color
 * @param {number} g2 - Green channel of second color
 * @param {number} b2 - Blue channel of second color
 * @returns {number} Squared distance (avoids expensive sqrt operation)
 */
export function colorDistanceSquared(r1, g1, b1, r2, g2, b2) {
    const dr = r1 - r2;
    const dg = g1 - g2;
    const db = b1 - b2;
    return dr * dr + dg * dg + db * db;
}

/**
 * Find the closest color in a palette to a given RGB color
 * @param {number} r - Red channel (0-255)
 * @param {number} g - Green channel (0-255)
 * @param {number} b - Blue channel (0-255)
 * @param {Array<Array<number>>} palette - Array of [r, g, b] color arrays
 * @returns {Array<number>} Closest color [r, g, b] from palette
 */
export function findClosestPaletteColor(r, g, b, palette) {
    if (!palette || palette.length === 0) {
        console.error("Invalid or empty palette provided to findClosestPaletteColor.");
        return [r, g, b];
    }

    let closestColor = palette[0];
    if (!Array.isArray(closestColor) || closestColor.length < 3) {
        console.warn("First palette entry is invalid. Using [0,0,0]");
        closestColor = [0, 0, 0];
    }

    let minDistance = colorDistanceSquared(r, g, b, closestColor[0], closestColor[1], closestColor[2]);

    for (let i = 1; i < palette.length; i++) {
        const color = palette[i];
        if (Array.isArray(color) && color.length >= 3) {
            const distance = colorDistanceSquared(r, g, b, color[0], color[1], color[2]);
            if (distance < minDistance) {
                minDistance = distance;
                closestColor = color;
            }
        } else {
            console.warn(`Invalid palette entry at index ${i} skipped.`);
        }
    }
    return closestColor;
}

/**
 * Convert image data to grayscale
 * @param {Uint8ClampedArray} data - Source image data
 * @returns {Uint8ClampedArray} Grayscale image data
 */
export function convertToGrayscale(data) {
    const grayData = new Uint8ClampedArray(data.length);
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];
        // Using luminosity method for grayscale conversion
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        grayData[i] = gray;
        grayData[i + 1] = gray;
        grayData[i + 2] = gray;
        grayData[i + 3] = alpha;
    }
    return grayData;
}

/**
 * Apply a simple Gaussian blur (box blur approximation)
 * @param {ImageData} imageData - Image data to blur
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} radius - Blur radius
 * @returns {ImageData} Blurred image data
 */
export function gaussianBlur(imageData, width, height, radius) {
    const data = imageData.data;
    const tempOutput = new Uint8ClampedArray(data.length);
    const outputData = new Uint8ClampedArray(data.length);
    radius = Math.max(1, Math.floor(radius));

    // Horizontal pass
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let rSum = 0, gSum = 0, bSum = 0, aSum = 0, count = 0;
            for (let kx = -radius; kx <= radius; kx++) {
                const currentX = Math.max(0, Math.min(width - 1, x + kx));
                const i = (y * width + currentX) * 4;
                if (data[i + 3] > 0) {
                    rSum += data[i];
                    gSum += data[i + 1];
                    bSum += data[i + 2];
                    aSum += data[i + 3];
                    count++;
                }
            }
            const targetI = (y * width + x) * 4;
            if (count > 0) {
                tempOutput[targetI] = rSum / count;
                tempOutput[targetI + 1] = gSum / count;
                tempOutput[targetI + 2] = bSum / count;
                tempOutput[targetI + 3] = aSum / count;
            } else {
                tempOutput[targetI] = 0;
                tempOutput[targetI + 1] = 0;
                tempOutput[targetI + 2] = 0;
                tempOutput[targetI + 3] = 0;
            }
        }
    }

    // Vertical pass
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let rSum = 0, gSum = 0, bSum = 0, aSum = 0, count = 0;
            for (let ky = -radius; ky <= radius; ky++) {
                const currentY = Math.max(0, Math.min(height - 1, y + ky));
                const i = (currentY * width + x) * 4;
                if (tempOutput[i + 3] > 0) {
                    rSum += tempOutput[i];
                    gSum += tempOutput[i + 1];
                    bSum += tempOutput[i + 2];
                    aSum += tempOutput[i + 3];
                    count++;
                }
            }
            const targetI = (y * width + x) * 4;
            if (count > 0) {
                outputData[targetI] = rSum / count;
                outputData[targetI + 1] = gSum / count;
                outputData[targetI + 2] = bSum / count;
                outputData[targetI + 3] = aSum / count;
            } else {
                outputData[targetI] = 0;
                outputData[targetI + 1] = 0;
                outputData[targetI + 2] = 0;
                outputData[targetI + 3] = 0;
            }
        }
    }
    return new ImageData(outputData, width, height);
}
