# Pixel Art Algorithms

> Powerful image-to-pixel-art conversion algorithms powering [ImageToPixel.Art](https://imagetopixel.art)

[![npm version](https://img.shields.io/npm/v/pixel-art-algorithms.svg)](https://www.npmjs.com/package/pixel-art-algorithms)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A high-performance JavaScript library for converting images into pixel art using advanced algorithms. Features intelligent color palette generation, multiple dithering techniques, and various visual effects.

## ✨ Features

- 🎨 **Median Cut Palette Generation** - Intelligent color quantization algorithm
- 🔲 **Dual Dithering Algorithms**
  - **Bayer Dithering** - Fast ordered dithering perfect for pixel art style
  - **Floyd-Steinberg Dithering** - High-quality error diffusion algorithm
- ⚡ **High Performance** - Optimized with TypedArrays (Uint8ClampedArray, Float32Array)
- 🌈 **Color Space Utilities** - RGB ↔ HSL conversion and hue shifting
- 🎯 **Simple API** - Clean, intuitive function signatures

## 🚀 Live Demo

Visit **[ImageToPixel.Art](https://imagetopixel.art)** to see these algorithms in action with a full-featured online editor.

## 📦 Installation

```bash
npm install pixel-art-algorithms
```

## 🎯 Quick Start

### Basic Pixel Art Conversion

```javascript
import { generatePalette, applyBayerDithering } from 'pixel-art-algorithms';

// Get image data from canvas
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

// Generate an 8-color palette using median cut algorithm
const palette = generatePalette(imageData.data, 8);

// Apply Bayer dithering with the generated palette
const ditheredData = applyBayerDithering(
    imageData.data,
    canvas.width,
    canvas.height,
    palette,
    100 // strength: 0-100
);

// Put the processed data back on canvas
const processedImageData = new ImageData(ditheredData, canvas.width, canvas.height);
ctx.putImageData(processedImageData, 0, 0);
```

### Floyd-Steinberg Dithering

```javascript
import { generatePalette, applyFloydSteinbergDithering } from 'pixel-art-algorithms';

const palette = generatePalette(imageData.data, 16); // 16-color palette
const ditheredData = applyFloydSteinbergDithering(
    imageData.data,
    canvas.width,
    canvas.height,
    palette
);
```

### Color Space Manipulation

```javascript
import { rgbToHsl, hslToRgb, applyHueShift } from 'pixel-art-algorithms';

// Convert RGB to HSL
const [h, s, l] = rgbToHsl(255, 128, 64);

// Convert back to RGB
const [r, g, b] = hslToRgb(h, s, l);

// Shift hue by 180 degrees
const shiftedData = applyHueShift(imageData.data, 180);
```

## 📚 API Reference

### Core Functions

#### `generatePalette(pixelDataArray, numColors)`

Generate a color palette using the median cut algorithm.

**Parameters:**
- `pixelDataArray` (Uint8ClampedArray): Flat RGBA pixel data
- `numColors` (number): Number of colors to generate (1-256)

**Returns:** Array of [r, g, b] colors

**Algorithm Details:**
- Uses median cut for optimal color quantization
- Automatically samples large images for performance (>65,536 pixels)
- Only considers opaque pixels (alpha > 128)
- Splits color space recursively along the widest dimension

```javascript
const palette = generatePalette(imageData.data, 8);
// Returns: [[255, 0, 0], [0, 255, 0], [0, 0, 255], ...]
```

#### `applyPalette(pixelDataArray, palette)`

Apply a color palette to image data without dithering.

**Parameters:**
- `pixelDataArray` (Uint8ClampedArray): Source image data
- `palette` (Array<[r, g, b]>): Target color palette

**Returns:** Uint8ClampedArray with palette applied

### Dithering Functions

#### `applyBayerDithering(pixelDataArray, width, height, palette, strengthPercent)`

Apply ordered Bayer dithering (fast, creates regular patterns).

**Parameters:**
- `pixelDataArray` (Uint8ClampedArray): Source image data
- `width` (number): Image width
- `height` (number): Image height
- `palette` (Array<[r, g, b]>): Target color palette
- `strengthPercent` (number): Dither strength 0-100

**Matrix Selection:**
- 0-33%: 2×2 matrix (subtle)
- 34-66%: 4×4 matrix (moderate)
- 67-100%: 8×8 matrix (strong)

#### `applyFloydSteinbergDithering(pixelDataArray, width, height, palette)`

Apply Floyd-Steinberg error diffusion dithering (high quality, no regular patterns).

**Error Distribution:**
- Right pixel: 7/16
- Bottom-left: 3/16
- Bottom: 5/16
- Bottom-right: 1/16

### Color Space Functions

#### `rgbToHsl(r, g, b)`

Convert RGB (0-255) to HSL (0-1).

**Returns:** [h, s, l] where each value is 0-1

#### `hslToRgb(h, s, l)`

Convert HSL (0-1) to RGB (0-255).

**Returns:** [r, g, b] where each value is 0-255

#### `applyHueShift(data, angle)`

Shift hue of entire image.

**Parameters:**
- `data` (Uint8ClampedArray): Image data (modified in place)
- `angle` (number): Rotation angle in degrees (-180 to 180)

### Utility Functions

#### `findClosestPaletteColor(r, g, b, palette)`

Find the closest color in a palette using Euclidean distance.

#### `convertToGrayscale(data)`

Convert image to grayscale using luminosity method (0.299R + 0.587G + 0.114B).

#### `gaussianBlur(imageData, width, height, radius)`

Apply box blur approximation of Gaussian blur.

## 🔬 Algorithm Deep Dive

### Median Cut Palette Generation

The median cut algorithm recursively subdivides the color space to find representative colors:

1. Start with all pixels in one bucket
2. Find the bucket with the largest color range (across R, G, or B)
3. Sort pixels in that bucket along the widest dimension
4. Split at the median into two buckets
5. Repeat until reaching the target number of colors
6. Average each bucket to get final palette colors

**Time Complexity:** O(n log k) where n = pixel count, k = color count

**Space Complexity:** O(n) for pixel storage

### Bayer Dithering

Ordered dithering using predefined threshold matrices:

```
2×2 Matrix:     4×4 Matrix:         8×8 Matrix:
[0 2]          [0  8  2 10]        [extensive pattern...]
[3 1]          [12 4 14  6]
               [3 11  1  9]
               [15 7 13  5]
```

Each pixel's threshold is determined by its position modulo matrix size, creating regular patterns ideal for pixel art.

### Floyd-Steinberg Dithering

Error diffusion algorithm that propagates quantization error to neighboring pixels:

```
      current → 7/16
3/16    5/16    1/16
```

This produces organic, non-repetitive patterns with excellent visual quality.

## 🌟 Real-World Usage

### [ImageToPixel.Art](https://imagetopixel.art)

A full-featured online pixel art converter built with these algorithms:
- Multi-language support (12+ languages)
- Real-time preview
- Custom palette creation
- Export in multiple formats

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build for distribution
npm run build

# Lint code
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 ImageToPixel.Art

## 🔗 Links

- **Live Tool:** [ImageToPixel.Art](https://imagetopixel.art)
- **npm Package:** [pixel-art-algorithms](https://www.npmjs.com/package/pixel-art-algorithms)
- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/pixel-art-algorithms/issues)

## 🙏 Acknowledgments

- Algorithm implementations inspired by classic image processing techniques
- Optimized for modern browsers and Node.js environments

---

**Built with ❤️ by the [ImageToPixel.Art](https://imagetopixel.art) team**
