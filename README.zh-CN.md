# 像素艺术算法库

> 为 [ImageToPixel.Art](https://imagetopixel.art) 提供核心算法支持的强大图像转像素艺术库

[![npm version](https://img.shields.io/npm/v/pixel-art-algorithms.svg)](https://www.npmjs.com/package/pixel-art-algorithms)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个高性能的 JavaScript 库，使用先进的算法将图像转换为像素艺术。具有智能调色板生成、多种抖动技术和各种视觉效果。

## ✨ 特性

- 🎨 **中位数切分调色板生成** - 智能颜色量化算法
- 🔲 **双抖动算法**
  - **Bayer 抖动** - 快速有序抖动，完美适配像素艺术风格
  - **Floyd-Steinberg 抖动** - 高质量误差扩散算法
- ⚡ **高性能** - 使用 TypedArray 优化（Uint8ClampedArray、Float32Array）
- 🌈 **颜色空间工具** - RGB ↔ HSL 转换和色调旋转
- 🎯 **简洁 API** - 清晰直观的函数签名

## 🚀 在线演示

访问 **[ImageToPixel.Art](https://imagetopixel.art)** 体验这些算法的完整在线编辑器。

## 📦 安装

```bash
npm install pixel-art-algorithms
```

## 🎯 快速开始

### 基础像素艺术转换

```javascript
import { generatePalette, applyBayerDithering } from 'pixel-art-algorithms';

// 从 canvas 获取图像数据
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

// 使用中位数切分算法生成 8 色调色板
const palette = generatePalette(imageData.data, 8);

// 应用 Bayer 抖动与生成的调色板
const ditheredData = applyBayerDithering(
    imageData.data,
    canvas.width,
    canvas.height,
    palette,
    100 // 强度: 0-100
);

// 将处理后的数据放回 canvas
const processedImageData = new ImageData(ditheredData, canvas.width, canvas.height);
ctx.putImageData(processedImageData, 0, 0);
```

### Floyd-Steinberg 抖动

```javascript
import { generatePalette, applyFloydSteinbergDithering } from 'pixel-art-algorithms';

const palette = generatePalette(imageData.data, 16); // 16 色调色板
const ditheredData = applyFloydSteinbergDithering(
    imageData.data,
    canvas.width,
    canvas.height,
    palette
);
```

### 颜色空间操作

```javascript
import { rgbToHsl, hslToRgb, applyHueShift } from 'pixel-art-algorithms';

// RGB 转 HSL
const [h, s, l] = rgbToHsl(255, 128, 64);

// HSL 转回 RGB
const [r, g, b] = hslToRgb(h, s, l);

// 色调旋转 180 度
const shiftedData = applyHueShift(imageData.data, 180);
```

## 📚 API 参考

### 核心函数

#### `generatePalette(pixelDataArray, numColors)`

使用中位数切分算法生成调色板。

**参数:**
- `pixelDataArray` (Uint8ClampedArray): 扁平化的 RGBA 像素数据
- `numColors` (number): 要生成的颜色数量 (1-256)

**返回:** [r, g, b] 颜色数组

**算法详情:**
- 使用中位数切分进行最优颜色量化
- 自动采样大图像以提升性能（>65,536 像素）
- 只考虑不透明像素（alpha > 128）
- 沿最宽维度递归分割颜色空间

#### `applyBayerDithering(pixelDataArray, width, height, palette, strengthPercent)`

应用有序 Bayer 抖动（快速，产生规则图案）。

**矩阵选择:**
- 0-33%: 2×2 矩阵（微妙）
- 34-66%: 4×4 矩阵（中等）
- 67-100%: 8×8 矩阵（强烈）

#### `applyFloydSteinbergDithering(pixelDataArray, width, height, palette)`

应用 Floyd-Steinberg 误差扩散抖动（高质量，无规则图案）。

**误差分配:**
- 右侧像素: 7/16
- 左下: 3/16
- 正下方: 5/16
- 右下: 1/16

## 🔬 算法深度解析

### 中位数切分调色板生成

中位数切分算法递归细分颜色空间以找到代表性颜色：

1. 从一个包含所有像素的桶开始
2. 找到颜色范围最大的桶（跨 R、G 或 B）
3. 沿最宽维度对该桶中的像素排序
4. 在中位数处分割成两个桶
5. 重复直到达到目标颜色数
6. 对每个桶求平均值得到最终调色板颜色

**时间复杂度:** O(n log k)，其中 n = 像素数，k = 颜色数

**空间复杂度:** O(n) 用于像素存储

### Bayer 抖动

使用预定义阈值矩阵的有序抖动：

```
2×2 矩阵:     4×4 矩阵:         8×8 矩阵:
[0 2]        [0  8  2 10]      [详细图案...]
[3 1]        [12 4 14  6]
             [3 11  1  9]
             [15 7 13  5]
```

每个像素的阈值由其位置模矩阵大小决定，创建理想的像素艺术规则图案。

### Floyd-Steinberg 抖动

误差扩散算法，将量化误差传播到相邻像素：

```
      当前 → 7/16
3/16    5/16    1/16
```

产生有机的、非重复的图案，具有出色的视觉质量。

## 🌟 实际应用

### [ImageToPixel.Art](https://imagetopixel.art)

使用这些算法构建的全功能在线像素艺术转换器：
- 多语言支持（12+ 语言）
- 实时预览
- 自定义调色板创建
- 多格式导出

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

Copyright (c) 2025 ImageToPixel.Art

## 🔗 链接

- **在线工具:** [ImageToPixel.Art](https://imagetopixel.art)
- **npm 包:** [pixel-art-algorithms](https://www.npmjs.com/package/pixel-art-algorithms)
- **问题反馈:** [GitHub Issues](https://github.com/YOUR_USERNAME/pixel-art-algorithms/issues)

---

**由 [ImageToPixel.Art](https://imagetopixel.art) 团队用 ❤️ 构建**
