# 🎶 爻舜的奇奇怪怪个人主页 (Kō Shun's Personal Website)

<div align="center">

![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Tech](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20VanillaJS-yellow?style=for-the-badge)
![Vibe](https://img.shields.io/badge/Vibe-Warm%20%26%20Healing-pink?style=for-the-badge)

<p align="center">
  <a href="#-项目简介">项目简介</a> •
  <a href="#-页面结构">页面结构</a> •
  <a href="#-核心功能">核心功能</a> •
  <a href="#-目录结构">目录结构</a> •
  <a href="#-本地运行">本地运行</a> •
  <a href="#-部署">部署</a>
</p>

</div>

> ✨ **"用声音记录生活，用代码记录发癫。"**
>
> 这里是 **爻舜 (Kō Shun)** 的数字后花园。主修医学、副业唱见、偶尔客串前端开发的 06 年 INFP，把热爱、碎碎念、"奇怪切片"和熬夜掉的头发都塞进了这个网页里。

---

## 📖 项目简介

这是一个**纯静态、无构建、无框架依赖**的个人作品集网站，包含一个独立的资源下载子站。

整个项目只使用原生 **HTML5 + CSS3 + JavaScript (ES6+)**，没有 `npm install`，没有打包步骤。视觉上追求"白天温暖奶油 + 夜晚赛博霓虹"，交互上尽量做到每一个按钮、每一次拖拽、每一个弹窗都有完整的动效反馈。

当前内容规模：

- 主站：首页 / 仓库 / 关于 / 最新投稿 / 属性五个区块
- 播放器：约 40 首歌曲，支持歌名溢出滚动
- 资源仓库：约 55 份资源，数量由 `resources.js` 动态计算
- 相册：11 张 WebP 图片，双份渲染实现无限循环

---

## 🗺️ 页面结构

导航和页面区块顺序保持一致：

1. **首页** `#home`：头像、状态胶囊、三个入口按钮、霓虹灯牌
2. **仓库** `#warehouse`：3D 次元星门，点击进入资源下载子站
3. **关于** `#about`：Bento 卡片式个人介绍、硬件、DAW、技能、项目
4. **最新投稿** `#portfolio`：三张最新 B 站视频卡片
5. **属性** `#gallery`：可拖拽、可点击放大的无限相册

资源子站入口：

- 主站按钮：`/download`
- 仓库星门：`#portal-gate`，点击后播放跃迁闪光再跳转

---

## ⚡ 核心功能

### 1. 首页氛围与视觉

- **双主题**：白天是米色点阵纸 + 马卡龙色，夜晚切换为赛博霓虹。主题在 `<head>` 里预加载，避免刷新时白屏闪烁。
- **背景微粒画布**：`#bg-ambient-canvas` 绘制缓慢漂浮的光斑，鼠标靠近时有轻微推力；开启"减少动态效果"时自动不启动。
- **3D 次元星门**：`#portal-canvas` 绘制 64 个旋转粒子，悬停时加速，点击时触发全屏跃迁闪光后进入 `/download`。
- **滚动体验**：导航栏滚动高亮、区块 IntersectionObserver 入场、Bento 卡片光标追光。

### 2. 悬浮黑胶播放器

- **黑胶唱机造型**：唱片、唱臂、12 段频谱、SVG 弧形音量环。
- **磁吸 + 拖拽**：桌面端播放器会轻微跟随鼠标；拖拽时限制在视口内，窗口缩放会自动拉回可视区域。
- **歌名滚动**：歌名超出显示宽度时，自动复制一份做无缝跑马灯，速度按文字长度计算；切歌、展开播放器、窗口缩放都会重新判断。
- **循环模式**：列表循环 / 单曲循环。
- **移动端形态**：默认收起为右下角胶囊；展开后是 200px 左右、接近 1:1 的小盒子，不再铺满屏幕。
- **音频按需加载**：`preload="none"`，点播放前不会预下载整首无损音频。

### 3. 最新投稿

- 在 `script.js` 的 `myVideos` 中手动配置标题、日期、封面、B 站链接。
- 桌面端悬停有 3D 倾角、随机歪头和全屏聚焦遮罩。
- 封面使用资源仓库里的 WebP 图片，卡片本身懒加载。

### 4. 关于我

- Bento 网格卡片：个人简介、硬件装备、DAW 与插件、技能、正在做的项目。
- 项目列表下方有一行签名式彩蛋文案："—— 前面的区域以后再来探索吧...."。
- 每个卡片支持光标追光，鼠标移动时有柔和的局部光感。

### 5. 无限相册

- 图片数据在 `gallery.js` 的 `galleryConfig` 中配置，当前全部为 WebP。
- 渲染时把数据复制两份，并向轨道前后各移动 6 个节点，形成视觉上的无限循环。
- 支持鼠标/触摸拖拽、惯性甩动、左右按钮、点击放大。
- 放大后的详情层支持点击空白处或按 `Esc` 关闭，图片项支持键盘 `Enter` / 空格打开。

### 6. 彩蛋

- 连续点击头像 **5 次**触发。
- 前 4 次有连击提示、迷你火花和 Web Audio 八音盒音符。
- 第 5 次打开全屏星海舞台：
  - Canvas 烟花与音符粒子
  - 点击夜空可继续发射烟花
  - Web Audio 实时合成八音盒旋律
  - 中间展示 `Picture/gai.gif`（不旋转、无额外光晕）
  - 支持关闭按钮和 `Esc`

### 7. 资源小仓库

资源页是一个独立的 `/download/` 子站，核心逻辑在 `download/script.js`。

- **搜索**：按标题、日期、简介、文件格式实时过滤。
- **分类**：全部 / 已发布作品 / 未发布作品 / 稀奇古怪的文件 / 福利内容，按钮上带动态数量。
- **排序**：新到旧 / 旧到新。
- **统计**：`共收录 X 份声音与数据碎片`，其中 X 来自 `resources.length`，增删资源后自动变化。
- **FLIP 展开**：点击卡片后从原位置平滑飞到屏幕中心，关闭时回到卡片位置。
- **流光边框**：旋转 conic-gradient + 白色扫光 + 外层模糊光晕；光晕只做色相流动，不会出现"大矩形在转"。
- **背景粒子**：卡片展开时在模糊遮罩层里运行螺旋粒子和漂浮尘埃，关闭立即停止。
- **底部下载按钮**：固定在详情卡片底部，简介在内部滚动，滚动条隐藏；按钮上方有渐隐层，长文案不会把按钮顶走。
- **打字机简介**：先渲染 HTML 再逐字揭晓，保留简介中的可点击链接；开启"减少动态效果"时直接显示全文。
- **键盘支持**：卡片 `Enter` / 空格打开，`Esc` 关闭。

---

## 🛠️ 技术栈

- **核心**：Semantic HTML5、CSS3 Variables、Vanilla JavaScript (ES6+)
- **布局**：Flexbox、CSS Grid、`clamp()`、`aspect-ratio`
- **动画**：CSS Transitions、Keyframes、FLIP、Canvas 2D、Web Audio API
- **字体**：`Nunito`、`ZCOOL KuaiLe`、`Patrick Hand`、本地 `演示佛系体`
- **图片**：WebP（资源封面、相册），JPG（头像），GIF（彩蛋）
- **无依赖**：没有框架、没有构建工具、没有 `node_modules`

---

## 📂 目录结构

```text
website/
├── index.html                 # 主站入口
├── style.css                  # 主站全局样式、主题变量、首页/关于/仓库/相册布局
├── mobile.css                 # 主站移动端适配（导航、按钮、卡片、区块）
├── script.js                  # 主站逻辑：视频、星门、滚动、主题、复制邮箱
│
├── player.js                  # 播放器逻辑：播放、切歌、拖拽、音量、歌名滚动
├── player.css                 # 播放器样式：黑胶、频谱、旋钮、折叠胶囊
├── songs.js                   # 歌单配置（title + src）
│
├── gallery.js                 # 相册逻辑：无限循环、拖拽惯性、灯箱
├── gallery.css                # 相册样式
│
├── easter-egg.js              # 彩蛋逻辑：连击、烟花、Web Audio、GIF 卡片
├── easter-egg.css             # 彩蛋样式
│
├── README.md                  # 本文件
│
├── Font/
│   └── 演示佛系体.ttf          # 手写风格字体（体积较大，建议后续子集化/woff2）
│
├── Picture/
│   ├── 头像.jpg
│   ├── gai.gif                # 彩蛋 GIF
│   └── Endless Gallery/       # 相册图片（1.webp ~ 11.webp）
│
└── download/                  # 资源下载子站
    ├── index.html             # 下载页入口
    ├── style.css              # 下载页样式：搜索、筛选、卡片、详情、流光、粒子
    ├── script.js              # 下载页逻辑：搜索/筛选/排序、FLIP、详情、粒子
    ├── resources.js           # 资源数据库 + 分类配置
    └── 资源仓库文件/           # 实际资源文件
        └── 作品名/
            ├── 1.webp         # 封面
            └── xxx.wav        # 音频/压缩包等
```

---

## 🧩 数据与配置

### 添加歌曲

编辑 `songs.js`：

```js
{
    title: "歌名",
    src: "./download/资源仓库文件/文件夹/音频.wav"
}
```

播放器会自动随机打乱歌单，并在切歌时更新标题、跑马灯和播放列表高亮。

### 添加资源

编辑 `download/resources.js`：

```js
{
    id: 56,
    title: "资源标题",
    type: "fc",                 // fc / qt / qg / fl
    date: "2026-11-24",
    desc: "简介，支持 <a href='...'>链接</a> 和 \n 换行",
    cover: "./资源仓库文件/文件夹/1.webp",
    size: "WAV | 50.0MB",
    link: "./资源仓库文件/文件夹/音频.wav"
}
```

分类配置在同一个文件的 `categoryConfig` 中，新增分类时同步添加 `type` 和显示名称即可。

资源总数、分类数量、搜索命中数都会自动计算，不需要手动改页面上的数字。

### 添加相册图片

编辑 `gallery.js` 的 `galleryConfig`：

```js
{ file: "12.webp", text: "图片说明" }
```

图片放在 `Picture/Endless Gallery/` 下。

### 修改最新投稿

编辑 `script.js` 的 `myVideos`，填入标题、日期、封面路径和 B 站链接。

---

## 🚀 本地运行

必须通过 HTTP 服务访问，不要直接双击 `index.html`。原因是站点里存在 `/download` 这类根路径链接，以及字体、音频、图片的相对路径，`file://` 下会失效。

在 `website/` 目录下执行：

```bash
python -m http.server 8000
```

然后访问：

```text
http://localhost:8000/
```

也可以使用 VS Code 的 Live Server，但根目录要指向 `website/`。

---

## 🌐 部署

推荐 Nginx，站点根目录指向 `website/`，确保 `/download` 子站可以正常访问：

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.key;

    root /path/to/website;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location /download {
        try_files $uri $uri/ /download/index.html;
    }
}
```

部署注意：

- 站点使用 `/download` 绝对路径，建议部署在域名根目录。
- 更新 CSS/JS 后浏览器可能缓存旧文件，测试时用 `Ctrl + F5` 强刷；生产环境可以给静态资源配置版本号或短缓存。
- 音频文件较大，建议服务器开启 Range 请求，播放器才能按需加载。
- 资源封面和相册已经使用 WebP，媒体文件可设置较长缓存。

---

## ⚙️ 性能与兼容性

- **图片**：资源封面和相册已转 WebP，封面长边限制 1600px。
- **音频**：`preload="none"`，只有点击播放才加载当前歌曲。
- **动效**：背景微粒尊重 `prefers-reduced-motion`；资源页粒子只在详情打开时运行。
- **字体**：`演示佛系体.ttf` 约 15MB，使用 `font-display: swap` 避免阻塞文字；后续建议做字体子集化 + woff2。
- **浏览器**：面向现代 Chrome / Edge / Safari / Firefox，依赖 WebP、Canvas、`backdrop-filter`、`aspect-ratio` 等特性。

---

## 🚧 待办事项

- [x] 资源封面与相册图片转 WebP
- [x] 资源数量、分类数量动态计算
- [x] 移动端播放器收起胶囊 / 展开小盒子
- [x] 播放器长歌名跑马灯
- [x] 资源详情固定下载按钮 + 隐藏滚动条
- [ ] `演示佛系体` 子集化并转 woff2
- [ ] 给 WAV 资源增加流媒体压缩版本（可选）
- [ ] 继续补充彩蛋与更多交互细节

---

## 🤝 贡献

如果发现 Bug（比如相册甩太快飞出去了），或者有更好的脑洞：

1. Fork 本仓库
2. 新建分支 `git checkout -b feature/AmazingIdea`
3. 提交代码 `git commit -m 'Add some magic'`
4. 新建 Pull Request

---

## 📜 许可证

本项目采用 **MIT License**。你可以随意修改、复制、商用，但请保留署名。

---

## ❤️ 致谢

- 感谢 **Gemini** 以及一路帮忙调试的 AI 工具
- 感谢 **StackOverflow** 和 **MDN**
- 感谢每一个听过我唱歌、点进这个网站的人

---

<p align="center">
  Made with <span style="color: #e25555;">&hearts;</span> and lots of ☕ by <b>爻舜 (Yao Shun)</b>
  <br>
  <i>2026 · Sichuan, China</i>
</p>
