# 🎶 爻舜的奇奇怪怪个人主页 (Yao Shun's Personal Website)

<div align="center">

![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Tech](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20VanillaJS-yellow?style=for-the-badge)
![Vibe](https://img.shields.io/badge/Vibe-Warm%20%26%20Healing-pink?style=for-the-badge)

<p align="center">
  <a href="#-核心亮点-features">核心亮点</a> •
  <a href="#-技术栈-tech-stack">技术栈</a> •
  <a href="#-目录结构-structure">目录结构</a> •
  <a href="#-食用指南-getting-started">食用指南</a> •
  <a href="#-部署运维-deployment">部署运维</a>
</p>

</div>

> ✨ **"用声音记录生活，用代码（虽然是现学的）记录发癫。"**
>
> 这里是 **爻舜 (Yao Shun)** 的数字后花园。作为一个主修医学、副业唱见、偶尔客串前端开发的 06 年 INFP，我把所有的热爱、碎碎念、"奇怪切片"以及**熬夜掉的头发**都塞进了这个网页里。

---

## 📖 项目简介 (Introduction)

本项目是一个**纯静态、无依赖、高性能**的个人作品集网站（含独立资源子站）。

在这个 React/Vue 满天飞的时代，本项目坚持“返璞归真”，完全使用原生 **HTML5, CSS3, JavaScript (ES6+)** 编写。这不仅是为了追求极致的加载速度（毕竟服务器只有 2 核 2G），更是为了证明：**只要脑洞够大，原生 JS 也能搓出 3A 级的交互动效。**

---

## ⚡ 核心亮点 (Features)

这里是给面试官或者技术宅看的，证明我不是只会写 `console.log`。

### 1. 🎵 磁吸式悬浮播放器 (Magnetic Music Player)
一个完全手搓的全局音频组件，拒绝套用现成插件。
* **磁吸交互 (Magnetic Effect)**：利用向量计算鼠标位置，实现“靠近即吸附、远离即回弹”的物理手感。
* **拟物化旋钮 (Physics Knob)**：音量调节采用旋转交互，阻尼感适中，且带有动态光晕反馈。
* **移动端小组件化**：在手机上自动形变为类似 iOS Widget 的小方块，操作直观。
* **防呆设计**：拖拽与点击互斥逻辑，防止误触。

### 2. 📂 资源小仓库 (The Resource Sub-site)
一个功能完备的资源下载子站 (`/download`)，实现了 SPA (单页应用) 级的体验。
* **FLIP 英雄转场 (Hero Transition)**：点击卡片时，通过计算坐标差 (`getBoundingClientRect`)，从原位置**平滑飞跃**至屏幕中心展开，关闭时又能**无缝归位**，拒绝生硬的弹窗。
* **RGB 流光边框**：展开后的卡片带有**赛博朋克风格的旋转流光**，白天是莫兰迪极光色，晚上是高亮霓虹色。
* **DOM 安全打字机**：重构了打字机逻辑，采用“先渲染后揭晓”策略，完美支持富文本（链接可点击），杜绝 HTML 结构崩坏。
* **多维筛选**：支持按分类过滤以及滑动式的时间排序。

### 3. 🌌 物理惯性无限画廊 (Physics-based Gallery)
位于主页的相册组件，手感极其丝滑。
* **双向预加载 (Double-ended Buffering)**：渲染时将数据克隆并预留了 **双向 Buffer**。无论你怎么暴力拖拽，永远滑不到尽头，彻底消除白边。
* **自研物理引擎**：实现了完整的触摸/鼠标手势监听，计算瞬时速度并引入**动量因子 (Momentum Factor)**，模拟真实世界的摩擦力与惯性。

### 4. 🌓 极致黑夜模式 (Ultimate Dark Mode)
* **防闪烁机制 (Anti-Flicker)**：通过 `<head>` 里的预加载脚本，在 DOM 渲染前锁定主题，彻底解决了刷新页面时“白屏一闪而过”的通病。
* **果冻开关**：切换按钮实现了一个基于 `@keyframes` 的 **果冻弹跳 (Jelly Bounce)** 动画。
* **全站适配**：从文字颜色到 RGB 边框流光，甚至遮罩层的模糊度，全部自动适配深色模式。

### 5. 🥚 隐藏彩蛋 (Easter Eggs)
* **超级果冻头像**：点击头像会有极强的果冻挤压感（Scale + Rotate 联动）。
* **连击触发**：偷偷告诉你，连续点击头像 **5次**，屏幕会炸开五颜六色的纸屑（Confetti），并弹出一个写给你的感谢卡片。

---

## 🛠️ 技术栈 (Tech Stack)

主打一个“手搓”，拒绝臃肿的 `node_modules`。

* **核心**：Semantic HTML5, CSS3 Variables, Vanilla JavaScript (ES6+)
* **布局**：Flexbox, CSS Grid (响应式网格), CSS Scrollbar Gutter
* **动画**：CSS Transitions (贝塞尔曲线调教), Keyframes, FLIP Technique, Canvas (粒子特效)
* **字体**：`Nunito`, `ZCOOL KuaiLe`, 以及手写风格的 `演示佛系体`。

---

## 📂 目录结构 (Structure)

模块化设计，主站、子站、播放器逻辑完全分离，互不干扰。

```text
personal-website/
├── index.html             # 🏠 主站入口
├── style.css              # 全局核心样式 & 黑夜模式变量
├── mobile.css             # 移动端专用适配样式
├── script.js              # 主站逻辑 (视频加载、交互特效)
│
├── player.js              # 🎵 播放器核心逻辑 (磁吸、拖拽)
├── player.css             # 播放器样式 (旋钮、列表)
├── songs.js               # 🎵 歌单配置文件
│
├── gallery.css            # 无限相册专用样式
├── gallery.js             # 无限相册核心逻辑 (物理惯性、Buffer算法)
│
├── easter-egg.css         # 🥚 彩蛋专用样式
├── easter-egg.js          # 🥚 彩蛋逻辑 (点击计数、粒子爆炸)
│
├── download/              # 📂 资源下载子站 (独立SPA风格)
│   ├── index.html         # 下载页入口
│   ├── style.css          # 下载页样式 (卡片网格、RGB边框、FLIP动画)
│   ├── script.js          # 下载页逻辑 (排序、筛选、打字机)
│   ├── resources.js       # 💾 资源数据库 (JSON配置)
│   └── 资源仓库文件/       # 存放实际文件 (MP3/Zip等)
│
├── Font/                  # 字体文件
└── Picture/               # 静态资源库
```
## 🚀 食用指南 (Getting Started)

### 本地运行
不需要 `npm`，不需要 `build`，开箱即用。
1.  克隆仓库：
    ```bash
    git clone [https://github.com/Yao-Shun-Ya/personal-website.git](https://github.com/Yao-Shun-Ya/personal-website.git)
    ```
2.  双击 `index.html` 直接打开。
3.  **Done.**

*(推荐使用 VS Code 的 "Live Server" 插件运行，体验更佳。)*

### 自定义配置
想改成你自己的？改这几个文件就够了：

1.  **修改视频**：`script.js` -> `loadFeaturedVideos` 函数。
2.  **修改相册**：`gallery.js` -> `galleryConfig` 对象。
3.  **添加下载资源**：`download/resources.js` -> 直接在数组里加 JSON 对象。

---

## 🌐 部署运维 (Deployment)

本项目完美支持 **Nginx** 部署。

### Nginx 配置示例
为了让 `/download` 子站和主站完美共存，且支持 HTTPS 跳转，推荐配置如下：

<details>
<summary>点击展开 Nginx 配置代码</summary>

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL 配置...
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.key;

    # ✅ 核心：指向包含 index.html 和 download 文件夹的根目录
    root /website; 
    index index.html;

    # 首页路由
    location / {
        try_files $uri $uri/ =404;
    }

    # 下载页路由 (自动寻找 /website/download/index.html)
    location /download {
        try_files $uri $uri/ /download/index.html;
    }
}
```
</details>

## 🎨 设计哲学 (Design Philosophy)

> **"Warmth in the Glitch"**

* **视觉风格**：整体采用 **微拟物 (Neuomorphism)** 与 **波普艺术** 的结合。白天是温暖的米色点阵纸风格，夜晚则是赛博朋克的 RGB 霓虹风格。
* **交互原则**：**"拒绝生硬"**。
    * 每一个按钮点击都要有果冻般的回弹。
    * 每一个弹窗关闭都要有“软着陆”的淡出。
    * 每一次拖拽都要符合物理惯性。
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

* 感谢 **Gemini** 的倾力相助，不仅写代码，还教会了我什么是“优雅的降级”和“物理惯性”。
* 感谢 **我自己** 吃苦耐劳，为了调那个 RGB 边框的动画参数，干到第二天早上六点半。
* 感谢 **StackOverflow** 和 **MDN**，没有你们就没有这个网站。
* 感谢 **Chilichill** 和 **Aimer** 的音乐提供的灵感。

---

<p align="center">
  Made with <span style="color: #e25555;">&hearts;</span> and lots of ☕ by <b>爻舜 (Yao Shun)</b>
  <br>
  <i>2025 · Sichuan, China</i>
</p>
