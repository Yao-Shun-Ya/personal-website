# 🎶 爻舜的奇奇怪怪个人主页 (Yao Shun's Personal Website)

![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Tech](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20VanillaJS-yellow?style=for-the-badge)
![Vibe](https://img.shields.io/badge/Vibe-Warm%20%26%20Healing-pink?style=for-the-badge)

> ✨ **"用声音记录生活，用代码（虽然是现学的）记录发癫。"**
>
> 这里是 **爻舜 (Kō Shun)** 的数字后花园。作为一个主修医学、副业唱见、偶尔客串前端开发的 06 年 INFP，我把热爱、碎碎念和“奇怪切片”塞了好多进了这个网页里。

---

## 📖 项目简介 (Introduction)

本项目是一个**纯静态、无依赖、高性能**的个人作品集网站。

在这个 React/Vue 满天飞的时代，本项目坚持“返璞归真”，完全使用原生 **HTML5, CSS3, JavaScript (ES6+)** 编写。这不仅是为了追求极致的加载速度（毕竟服务器只有 2 核 2G），也是为了证明：**只要脑洞够大，原生 JS 也能搓出 3A 级的交互动效。**

网站主要包含以下模块：
* **Hero 区域**：Q 弹的头像与自我介绍。
* **最新投稿**：Bilibili 与网易云音乐的作品展示，带有影院级聚焦特效。
* **关于我**：详细的硬件装备与 DAW 介绍（医学生的严谨体现在列参数上）。
* **无限画廊**：一个支持物理惯性拖拽、双向预加载缓冲的无限循环相册。

---

## 🛠️ 技术栈 (Tech Stack)

本项目没用任何高大上的框架，主打一个“手搓”：

* **结构**：Semantic HTML5
* **样式**：CSS3 Variables (用于黑夜模式), Flexbox, Grid, CSS Animations, Media Queries
* **逻辑**：Vanilla JavaScript (ES6+)
* **字体**：`Nunito`, `ZCOOL KuaiLe`, `Patrick Hand`, 以及手写风格的 `演示佛系体`。

---

## ⚡ 核心亮点与硬核实现 (Highlights)

这里是给面试官或者技术宅看的，证明我不是只会写 `console.log`。

### 1. 🌌 物理惯性无限画廊 (Physics-based Infinite Gallery)
这是整个项目最复杂的组件（位于 `gallery.js`）。
* **双向预加载 (Double-ended Buffering)**：为了防止快速滑动时出现“白边”，我们在 DOM 渲染时将图片数据克隆了两份，并在左右两侧各预留了 **6 张缓冲区 (Buffer)**。无论你怎么暴力拖拽，永远滑不到尽头。
* **自研物理引擎**：实现了 `mousedown`, `mousemove`, `mouseup` 的完整手势监听。
    * 计算手指离开屏幕时的**瞬时速度** (`velocity = displacement / time`)。
    * 引入**动量因子 (Momentum Factor)**，模拟真实世界的摩擦力与惯性滑动。
    * **智能吸附**：滑动结束时，会自动计算最近的卡片位置并平滑回弹。
* **移动端适配**：自动识别 `vw` 单位，手机竖屏时自动调整长宽比为 3:4，完美适配单手操作。

### 2. 🎥 影院级英雄转场 (Hero Transition)
点击相册图片时，并非简单的 `display: block` 弹窗，而是实现了一个复杂的 **FLIP (First, Last, Invert, Play)** 动画变种：
1.  **克隆替身**：点击瞬间，在 `body` 根节点生成一个位置完全重合的“替身”元素，并不受父级 `overflow: hidden` 的遮罩限制。
2.  **动态计算**：通过 `getBoundingClientRect` 实时计算图片中心点与视口中心点 (Viewport Center) 的差值 (`deltaX`, `deltaY`)。
3.  **自适应缩放**：根据当前设备是 PC 还是 Mobile，智能计算最大放大倍率（PC 端限制高度，Mobile 端限制宽度），确保不爆屏。
4.  **丝滑归位**：关闭时，移除 CSS 类，利用 CSS Transition 自动让图片“飞”回原处，随后销毁 DOM。

### 3. 🌓 沉浸式黑夜/霓虹模式
* **CSS 变量驱动**：全站颜色（背景、文字、卡片、阴影）均抽离为 CSS 变量 (`:root` vs `[data-theme="dark"]`)。
* **Q 弹开关**：切换按钮实现了一个基于 `@keyframes` 的 **果冻弹跳 (Jelly Bounce)** 动画，且太阳/月亮图标通过旋转+缩放进行无缝切换，拒绝生硬。
* **霓虹光晕**：黑夜模式下，所有卡片聚焦时不再是黑色阴影，而是带有呼吸感的**青色/粉色霓虹光晕**，营造深夜电台的氛围。

---

## 📂 项目结构 (Structure)

为了保持代码整洁（强迫症狂喜），我们将逻辑进行了模块化拆分：

```text
personal-website/
├── index.html          # 网站入口，语义化标签结构
├── style.css           # 全局样式、黑夜模式变量、Hero区域样式
├── gallery.css         # 独立的相册样式、遮罩Mask逻辑、Hero转场动画
├── mobile.css          # 移动端专用样式（覆盖式媒体查询）
├── script.js           # 视频列表渲染、平滑滚动、黑夜模式逻辑
├── gallery.js          # 相册核心逻辑（拖拽、惯性、Buffer算法）
├── Font/               # 字体文件 (演示佛系体.ttf)
└── Picture/            # 静态资源
    ├── Endless Gallery/  # 相册图片源
    └── 投稿图片/         # 视频封面
```

## 🚀 食用指南 (Getting Started)

### 本地运行
不需要 `npm install`，不需要 `webpack`，不需要 `build`。
1.  克隆仓库：
    ```bash
    git clone [https://github.com/your-username/personal-website.git](https://github.com/your-username/personal-website.git)
    ```
2.  双击 `index.html`。
3.  **Done.** 就是这么简单。

*(推荐使用 VS Code 的 "Live Server" 插件运行，体验更佳。)*

### 自定义配置
想改成你自己的网站？很简单：

1.  **修改视频列表**：打开 `script.js`，找到 `loadFeaturedVideos` 函数，修改 `myVideos` 数组即可。
2.  **修改相册图片**：打开 `gallery.js`，找到 `galleryConfig` 对象，修改文件名和配文。
3.  **更换字体**：把你的字体放入 `Font/` 文件夹，并在 `style.css` 头部修改 `@font-face`。

---

## 🎨 设计哲学 (Design Philosophy)

> **"Warmth in the Glitch"**

* **视觉风格**：整体采用**微拟物 (Neuomorphism)** 与 **波普艺术** 的结合。白天是温暖的米色点阵纸风格，夜晚则是赛博朋克的霓虹风格。
* **交互原则**：**"反馈感"**。每一个按钮点击都要有回弹，每一次鼠标悬停都要有位移，每一次拖拽都要有惯性。拒绝死板的静态网页。
* **情感化设计**：导航栏使用了“演示佛系体”，配合俏皮的文案，尝试打破互联网的冰冷感，还原一个真实的、鲜活的男大精神状态。

---

## 🚧 待办事项 (To-Do List)

虽然现在已经很酷了，但我还有更多想法：
- [ ] **集成网易云 API**：目前是手动链接，未来希望能做一个迷你的播放器条。
- [ ] **更多彩蛋**：比如点击头像 10 次会触发一些奇怪的特效（正在构思中）。
- [ ] **性能优化**：把现有的 JPG/PNG 全部转为 WebP 格式。
- [ ] **3D 元素**：考虑引入 Three.js 做一个 3D 的音符背景（如果我不犯懒的话）。

---

## 🤝 贡献 (Contributing)

如果你发现了 Bug（比如相册甩太快飞出去了），或者有更好的脑洞：
1.  Fork 本仓库。
2.  新建分支 `git checkout -b feature/AmazingIdea`。
3.  提交代码 `git commit -m 'Add some magic'`。
4.  新建 Pull Request。

---

## 📜 许可证 (License)

本项目采用 **MIT License**。
你可以随意修改、复制、商用，但请保留我的署名（毕竟代码也是我辛辛苦苦敲的呜呜）。

---

## ❤️ 致谢

* 感谢 **Gemini** 的倾力相助，果真是好用。
* 感谢 **我自己** 吃苦耐劳干到第二天六点半。
* 感谢 **StackOverflow** 和 **MDN**，没有你们就没有这个网站。

---

<p align="center">
  Made with <span style="color: #e25555;">&hearts;</span> and lots of ☕ by <b>爻舜 (Yao Shun)</b>
  <br>
  <i>2025 · Sichuan, China</i>
</p>
