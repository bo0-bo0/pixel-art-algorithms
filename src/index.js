/**
 * Pixel Art Algorithms Library
 * Main entry point - exports all functions
 */

// Core algorithms
export { generatePalette, applyPalette } from './core/palette.js';

// Dithering algorithms
export { applyBayerDithering } from './dithering/bayer.js';
export { applyFloydSteinbergDithering } from './dithering/floydSteinberg.js';

// Color space utilities
export { rgbToHsl, hslToRgb, applyHueShift } from './utils/colorSpace.js';

// Helper utilities
export {
    colorDistanceSquared,
    findClosestPaletteColor,
    convertToGrayscale,
    gaussianBlur
} from './utils/helpers.js';

// Version
export const VERSION = '1.0.0';
