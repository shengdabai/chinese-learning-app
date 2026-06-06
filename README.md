# 🀄 LinguaLens — AI Chinese Learning App

**English | [中文](#中文)**

[![Last commit](https://img.shields.io/github/last-commit/shengdabai/chinese-learning-app)](https://github.com/shengdabai/chinese-learning-app/commits)
[![Stars](https://img.shields.io/github/stars/shengdabai/chinese-learning-app?style=social)](https://github.com/shengdabai/chinese-learning-app/stargazers)
[![Follow @shengdabai](https://img.shields.io/github/followers/shengdabai?style=social)](https://github.com/shengdabai)

> Point your camera at the world, talk to an AI tutor, and learn Chinese from real life — not flashcards.

LinguaLens turns a phone camera and a microphone into a Chinese tutor. Snap a photo of anything around you to get the Chinese word, pinyin, tone, and a spaced-repetition card. Then practice speaking it in live voice conversations and roleplay scenarios — all powered by Google Gemini.

## Why

Textbook vocabulary fades because it's disconnected from your life. LinguaLens grounds every new word in something you can see and a conversation you actually have, so it sticks. It's built by a Chinese-language teacher with 6,000+ students, in public.

## What it does

LinguaLens is a client-side React app. You bring a Google Gemini API key; everything runs in the browser.

## ✨ Features

- **📸 Snap & Learn** — Point your camera at any object; Gemini identifies it and returns the Chinese word, pinyin, and meaning, then turns it into a review card.
- **🎥 Live Mode** — Real-time voice conversation with an AI tutor using Gemini's native-audio model, for pronunciation and listening practice.
- **🎭 Roleplay Scenarios** — Pick a real-world scene (ordering food, taking a taxi, etc.) and hold a guided conversation in character.
- **🔁 SRS Review** — A built-in spaced-repetition system schedules your captured words for review, with progress stats.
- **🎯 Quests & Profile** — Daily snap/speak quests, XP, and levels keep you coming back; your profile tracks progress locally.
- **🔐 Local Auth & Storage** — Lightweight sign-in and on-device persistence — no backend required to get started.

## 🧱 Tech stack

- **React 19** + **TypeScript**
- **Vite 6** build tooling
- **Google GenAI** (`@google/genai`) — `gemini-2.5-flash` for vision, `gemini-2.5-flash-native-audio-preview` for live voice
- **Tailwind CSS** (via CDN) + **lucide-react** icons
- **Web Audio API** for live audio, **React state + local storage** for persistence (no server)

## 🚀 Quick start

**Prerequisites:** Node.js 18+ and a [Google Gemini API key](https://ai.google.dev/). A Chromium-based browser is recommended for camera and microphone access.

```bash
# 1. Clone
git clone https://github.com/shengdabai/chinese-learning-app.git
cd chinese-learning-app

# 2. Install
npm install

# 3. Add your API key
cp .env.example .env.local
# then edit .env.local and set:
#   VITE_GEMINI_API_KEY=your_api_key_here

# 4. Run (dev server on http://localhost:3000)
npm run dev
```

Build and preview a production bundle:

```bash
npm run build
npm run preview
```

> ⚠️ The Gemini key is bundled into the client at build time. For anything beyond local/personal use, proxy Gemini calls through your own backend instead of shipping the key to the browser.

## 📖 Usage

- **Snap** — Grant camera access, point at an object, and capture. You get the word + pinyin + meaning and a new review card.
- **Live** — Grant microphone access and start a voice session to practice speaking and listening.
- **Roleplay** — Choose a scenario and converse in character with the AI.
- **Review** — Work through your SRS queue to lock in vocabulary.
- **Profile** — Check XP, level, quests, and learning progress.

## 🗺️ Status

Active, in-public project. Core modes (Snap, Live, Roleplay, SRS, Quests/Profile) are working. It's a fully client-side build with local persistence; a key proxy and richer content are natural next steps. Issues and ideas are welcome.

## 🤝 Connect / About

Built by **Tony (Sheng)** — a Chinese-language teacher with 6,000+ students, building AI + Chinese-teaching tools in public.

If LinguaLens is useful or interesting, please **⭐ Star this repo** and **[Follow @shengdabai](https://github.com/shengdabai)** to see what ships next.

More Chinese-learning and AI tools in the works:

- **[chinese-mission](https://github.com/shengdabai/chinese-mission)**
- **[LinguaLens](https://github.com/shengdabai/LinguaLens)**
- **[hsk-prep-platform](https://github.com/shengdabai/hsk-prep-platform)**

## License

No license file is currently included, so all rights are reserved by default. If you'd like to use or build on this, please open an issue.

---

# 中文

**[English](#-lingualens--ai-chinese-learning-app) | 中文**

[![Last commit](https://img.shields.io/github/last-commit/shengdabai/chinese-learning-app)](https://github.com/shengdabai/chinese-learning-app/commits)
[![Stars](https://img.shields.io/github/stars/shengdabai/chinese-learning-app?style=social)](https://github.com/shengdabai/chinese-learning-app/stargazers)
[![关注 @shengdabai](https://img.shields.io/github/followers/shengdabai?style=social)](https://github.com/shengdabai)

> 把镜头对准你身边的世界，和 AI 老师对话，从真实生活里学中文——而不是死记卡片。

LinguaLens 把手机镜头和麦克风变成一位中文老师。对任何东西拍一张照，立刻得到它的中文词、拼音、声调，并自动生成一张间隔复习卡；再通过实时语音对话和角色扮演把它练熟——全部由 Google Gemini 驱动。

## 为什么

课本词汇之所以容易忘，是因为它和你的生活脱节。LinguaLens 让每个新词都对应你看得见的东西和一段你真正发生过的对话，于是它就记住了。本项目由一位拥有 6000+ 学员的中文老师公开打造。

## 它能做什么

LinguaLens 是一个纯前端 React 应用。你只需提供一个 Google Gemini API Key，一切都在浏览器里运行。

## ✨ 功能

- **📸 拍照即学** — 用镜头对准任意物体，Gemini 识别后返回中文词、拼音和释义，并生成一张复习卡。
- **🎥 直播模式** — 使用 Gemini 原生音频模型与 AI 老师实时语音对话，练习发音和听力。
- **🎭 角色扮演场景** — 选择真实生活场景（点餐、打车等），在角色中进行引导式对话。
- **🔁 SRS 间隔复习** — 内置间隔重复系统，自动安排你拍到的词进行复习，并提供进度统计。
- **🎯 任务与档案** — 每日拍照/口语任务、XP 与等级让你持续回来；个人档案在本地记录进度。
- **🔐 本地登录与存储** — 轻量登录 + 设备本地持久化，无需后端即可上手。

## 🧱 技术栈

- **React 19** + **TypeScript**
- **Vite 6** 构建工具
- **Google GenAI**（`@google/genai`）—— 视觉用 `gemini-2.5-flash`，实时语音用 `gemini-2.5-flash-native-audio-preview`
- **Tailwind CSS**（CDN 引入）+ **lucide-react** 图标
- **Web Audio API** 处理实时音频，**React 状态 + 本地存储** 做持久化（无服务器）

## 🚀 快速开始

**前置要求：** Node.js 18+ 和一个 [Google Gemini API Key](https://ai.google.dev/)。推荐使用基于 Chromium 的浏览器以获得相机和麦克风权限。

```bash
# 1. 克隆
git clone https://github.com/shengdabai/chinese-learning-app.git
cd chinese-learning-app

# 2. 安装依赖
npm install

# 3. 配置 API Key
cp .env.example .env.local
# 然后编辑 .env.local，设置：
#   VITE_GEMINI_API_KEY=your_api_key_here

# 4. 启动（开发服务器：http://localhost:3000）
npm run dev
```

构建并预览生产版本：

```bash
npm run build
npm run preview
```

> ⚠️ Gemini Key 会在构建时打包进客户端。除本地/个人使用外，请通过你自己的后端代理 Gemini 调用，而不要把 Key 直接发到浏览器。

## 📖 使用方法

- **拍照** — 授予相机权限，对准物体拍摄，即可得到词 + 拼音 + 释义和一张新复习卡。
- **直播** — 授予麦克风权限，开始语音会话，练习口语和听力。
- **角色扮演** — 选择一个场景，与 AI 在角色中对话。
- **复习** — 完成 SRS 复习队列，巩固词汇。
- **档案** — 查看 XP、等级、任务和学习进度。

## 🗺️ 状态

公开开发中的活跃项目。核心模式（拍照、直播、角色扮演、SRS、任务/档案）均已可用。当前为纯前端构建 + 本地持久化；Key 代理与更丰富的内容是自然的下一步。欢迎提交 Issue 和想法。

## 🤝 联系 / 关于

由 **Tony（Sheng）** 打造——一位拥有 6000+ 学员的中文老师，公开构建 AI + 中文教学工具。

如果 LinguaLens 对你有用或有趣，欢迎 **⭐ Star 本仓库** 并 **[关注 @shengdabai](https://github.com/shengdabai)**，第一时间看到后续更新。

更多正在开发的中文学习与 AI 工具：

- **[chinese-mission](https://github.com/shengdabai/chinese-mission)**
- **[LinguaLens](https://github.com/shengdabai/LinguaLens)**
- **[hsk-prep-platform](https://github.com/shengdabai/hsk-prep-platform)**

## 许可证

当前仓库未包含许可证文件，因此默认保留所有权利。如希望使用或基于本项目开发，请提交 Issue。
