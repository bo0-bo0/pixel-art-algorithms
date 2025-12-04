# 项目开源实施指南

本文档详细说明如何将 `pixel-art-algorithms` 项目开源并进行宣传推广。

## 📋 当前项目状态

### 已完成的工作 ✅

1. **项目结构创建**
   - ✅ 创建了完整的目录结构
   - ✅ 核心算法模块化（palette.js、bayer.js、floydSteinberg.js）
   - ✅ 工具函数提取（colorSpace.js、helpers.js）

2. **配置文件**
   - ✅ package.json（npm 发布配置）
   - ✅ rollup.config.js（构建配置）
   - ✅ .gitignore（Git 忽略文件）
   - ✅ LICENSE（MIT 许可证）

3. **文档**
   - ✅ README.md（英文完整文档）
   - ✅ README.zh-CN.md（中文完整文档）
   - ✅ 详细的 API 参考
   - ✅ 算法原理讲解

4. **示例代码**
   - ✅ examples/basic-example.html（可交互的在线示例）

5. **CI/CD**
   - ✅ GitHub Actions 自动发布到 npm

## 🚀 接下来的步骤

### 第一步：初始化 Git 仓库（本地）

```bash
cd D:\Webdev\pixel-art-algorithms

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 第一次提交
git commit -m "Initial commit: Pixel art algorithms library

- Core median cut palette generation
- Bayer and Floyd-Steinberg dithering
- Color space utilities
- Complete documentation
- Interactive examples"
```

### 第二步：在 GitHub 创建公开仓库

1. 访问 https://github.com/new
2. 仓库名称: `pixel-art-algorithms`
3. 描述: `Powerful pixel art conversion algorithms powering ImageToPixel.Art`
4. **选择 Public（公开）**
5. **不要** 勾选 "Initialize with README"（我们已经有了）
6. 点击 "Create repository"

### 第三步：推送到 GitHub

```bash
# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/pixel-art-algorithms.git

# 推送到 main 分支
git branch -M main
git push -u origin main
```

### 第四步：配置 GitHub 仓库设置

#### 1. 添加 Topics（标签）

在仓库页面，点击 "About" 旁边的设置图标，添加以下 topics:
```
pixel-art
image-processing
dithering
palette-generation
median-cut
floyd-steinberg
bayer-dithering
canvas
javascript
typescript
computer-vision
color-quantization
```

#### 2. 启用 GitHub Pages（可选）

- Settings → Pages
- Source: 选择 `main` 分支的 `/docs` 或 `/examples` 文件夹
- 可以展示示例页面

#### 3. 设置社交预览图

- Settings → General → Social preview
- 上传一张 1200x630 的图片，展示算法效果对比

### 第五步：发布到 npm

#### 1. 创建 npm 账号

如果没有账号：
- 访问 https://www.npmjs.com/signup
- 创建账号

#### 2. 本地登录 npm

```bash
npm login
# 输入用户名、密码和邮箱
```

#### 3. 检查包名是否可用

```bash
npm search pixel-art-algorithms
```

如果名字已被占用，修改 `package.json` 中的 `name` 字段。

#### 4. 构建项目

```bash
cd D:\Webdev\pixel-art-algorithms

# 安装依赖
npm install

# 构建
npm run build
```

#### 5. 发布到 npm

```bash
# 第一次发布
npm publish

# 如果是 scoped package（如 @yourname/pixel-art-algorithms）
npm publish --access public
```

#### 6. 配置 npm token for GitHub Actions

1. 在 npmjs.com 生成 Access Token
   - https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - "Generate New Token" → "Automation"
   - 复制 token

2. 在 GitHub 仓库添加 Secret
   - Settings → Secrets and variables → Actions
   - "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: 粘贴刚才复制的 token

### 第六步：在原网站添加引用链接

修改 `imagetopixel.art` 项目的模板文件：

#### 1. 在页脚添加链接

编辑 `templates/layout.ejs`:

```html
<footer class="site-footer">
    <p>
        Powered by
        <a href="https://github.com/YOUR_USERNAME/pixel-art-algorithms"
           target="_blank" rel="noopener">
            Open Source Algorithms ⭐
        </a>
    </p>
    <p>&copy; 2025 ImageToPixel.Art</p>
</footer>
```

#### 2. 在 README.md 添加链接

编辑原项目的 `README.md`:

```markdown
## Technology Stack

This project uses:
- [pixel-art-algorithms](https://github.com/YOUR_USERNAME/pixel-art-algorithms) - Open source pixel art conversion algorithms
- Node.js + EJS for static site generation
- Cloudflare Pages for hosting
```

#### 3. 添加 "View Source" 按钮（可选）

在工具页面添加一个按钮：

```html
<a href="https://github.com/YOUR_USERNAME/pixel-art-algorithms"
   class="view-source-btn"
   target="_blank">
    <svg><!-- GitHub icon --></svg>
    View Algorithm Source
</a>
```

### 第七步：宣传推广

#### 1. 技术社区发布

**Hacker News (Show HN)**
```
标题: Show HN: Pixel Art Algorithms – Open source median cut & dithering in JavaScript
链接: https://github.com/YOUR_USERNAME/pixel-art-algorithms
内容: Hi HN! I built and open-sourced the core algorithms behind ImageToPixel.Art.
It includes median cut palette generation and two dithering algorithms (Bayer & Floyd-Steinberg).
Check out the live demo at https://imagetopixel.art
```

**Reddit**
- r/javascript
- r/webdev
- r/PixelArt
- r/programming

标题建议:
```
[r/javascript] Released: pixel-art-algorithms - Median cut & dithering in pure JavaScript
[r/PixelArt] Open-sourced the algorithms behind our pixel art converter
```

**Dev.to 博客文章**

写一篇技术博客：
```markdown
# Building a Pixel Art Converter: Median Cut & Dithering Algorithms Explained

## Introduction
I recently open-sourced the core algorithms behind ImageToPixel.Art...

## The Median Cut Algorithm
[详细解释算法原理，配代码和图示]

## Dithering: Bayer vs Floyd-Steinberg
[对比两种算法]

## Performance Optimizations
[讲解 TypedArray 优化]

## Try it yourself
- Live demo: https://imagetopixel.art
- GitHub: https://github.com/YOUR_USERNAME/pixel-art-algorithms
- npm: npm install pixel-art-algorithms
```

**Twitter/X 发布**
```
🎨 Just open-sourced the pixel art algorithms behind @ImageToPixelArt!

✅ Median cut palette generation
✅ Bayer & Floyd-Steinberg dithering
✅ Pure JavaScript, zero dependencies
✅ TypedArray optimized

npm install pixel-art-algorithms

Live demo: https://imagetopixel.art
Code: https://github.com/YOUR_USERNAME/pixel-art-algorithms
```

#### 2. Product Hunt 发布

1. 准备素材
   - Logo（260x260）
   - 预览图（多张算法效果对比图）
   - Tagline: "Open source pixel art conversion algorithms"
   - 描述: 详细说明功能和应用场景

2. 在合适的时间发布（周二-周四早上较好）

#### 3. 中文社区推广

**掘金（juejin.cn）**
```
标题: 我开源了一个像素艺术转换算法库：中位数切分 + 双抖动算法
标签: JavaScript, 开源, 图像处理, Canvas
```

**知乎**
```
问题: 有哪些值得推荐的图像处理 JavaScript 库？
回答: 分享我开源的 pixel-art-algorithms...
```

**V2EX**
```
节点: 分享创造
标题: [开源] pixel-art-algorithms - 图像转像素艺术算法库
```

**SegmentFault**

写技术文章，详细讲解算法实现。

### 第八步：持续维护

#### 1. 响应 Issues 和 Pull Requests

- 及时回复用户问题
- 审核并合并有价值的 PR
- 维护 Changelog

#### 2. 发布新版本

```bash
# 修改版本号
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# 推送标签
git push --tags

# GitHub Release 会自动触发 npm 发布
```

#### 3. 收集反馈

- 建立 Discussions 区域
- 收集用户建议和使用案例
- 在 README 添加 "Used by" 区域

## 📊 预期指标

### 短期（1-3个月）
- GitHub Stars: 50-200+
- npm 周下载: 100-500
- 网站流量提升: 20-30%

### 中期（3-6个月）
- GitHub Stars: 200-500+
- npm 周下载: 500-2000
- 成为 `pixel-art` topic 的热门项目

### 长期（6-12个月）
- GitHub Stars: 500-1000+
- npm 周下载: 2000-5000
- 吸引其他项目使用
- 建立技术社区影响力

## 🎯 成功案例参考

类似的成功开源项目：
1. **fabric.js** - Canvas 库
2. **jimp** - 图像处理库
3. **gifuct-js** - GIF 解析库

学习它们的：
- README 结构
- 示例展示方式
- 社区互动方式

## ⚠️ 注意事项

### 1. 代码质量

- ✅ 已使用 ES6 模块化
- ✅ 已添加详细注释
- 🔄 后续可添加 TypeScript 类型定义（.d.ts）
- 🔄 后续可添加单元测试

### 2. 文档维护

- 保持 README 更新
- 添加更多示例
- 记录 Breaking Changes

### 3. 许可证

- MIT License 允许商业使用
- 要求保留版权声明
- 不提供任何保证

### 4. 安全性

- 定期更新依赖
- 使用 `npm audit` 检查漏洞
- 不在代码中包含敏感信息

## 📞 需要帮助？

如果在任何步骤遇到问题，可以：
1. 查看 GitHub Guides: https://guides.github.com/
2. 查看 npm 文档: https://docs.npmjs.com/
3. 在 GitHub Discussions 提问

---

**祝开源之旅顺利！🚀**
