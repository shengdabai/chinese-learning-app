# chinese-learning-app

LinguaLens: AI Chinese tutor — snap a photo to learn words, then practice with live voice & roleplay. React 19 + Gemini.

## Business Context

- **Category:** education product
- **Audience:** learners, teachers, parents, and education operators who need a clearer learning or exam-prep workflow.
- **Repository status:** Public repository. Keep examples, docs, and issues free of credentials, private data, and machine-specific paths.
- **Topics:** ai, chinese-learning, gemini, language-learning, react, spaced-repetition, typescript, webapp

## What This Project Is For

- LinguaLens: AI Chinese tutor — snap a photo to learn words, then practice with live voice & roleplay. React 19 + Gemini.
- Give users a concrete learning workflow instead of a loose collection of content.
- Make practice, feedback, review, or recommendation steps easier to repeat.

## Where It Fits

This repository supports productized learning workflows: diagnostic input, guided practice, review loops, and clearer handoff between learner, teacher, and software.

## Technical Overview

- **Primary language:** TypeScript
- **Detected stack:** TypeScript, Node.js, Vite, React
- **Default branch:** `main`
- **Visibility:** `PUBLIC`
- **License:** MIT License

> **Security notice:** Because this is a pure client-side app, your Gemini API key is embedded in the browser bundle at build time and is visible to anyone who inspects the page. **Run this app only for personal/local use, or behind a private URL.** Do not deploy it publicly with a shared API key. For a production deployment, proxy Gemini calls through a server-side function (e.g. Cloudflare Worker or Vercel Edge Function) so the key never reaches the client.

## ✨ Features

## Repository Map

- `src`
- `.env.example`
- `LICENSE`
- `README.md`
- `SECURITY.md`
- `claude中文学习.md`
- `codex中文学习.md`
- `gemini中文学习.md`
- `index.css`
- `index.html`
- `index.tsx`
- `metadata.json`

## Quick Start

Use the commands that match the current project state:

```bash
npm install
npm run dev
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

Released under the [MIT License](./LICENSE).

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
```

| Command | Purpose |
|---|---|
| `npm install` | Install project dependencies. |
| `npm run dev` | vite |
| `npm run preview` | vite preview |
| `npm run build` | vite build |

## Operating Notes

- Keep real credentials out of the repository. Use local environment files, GitHub repository secrets, or the deployment platform secret manager.
- If a `.env.example` file exists, treat it as documentation only; never commit filled-in `.env` files.
- Before publishing screenshots, demos, or client examples, remove private names, internal paths, account IDs, and API endpoints.
- The `Repository Hygiene` workflow is a lightweight guardrail, not a replacement for product-specific tests.

## Delivery Checklist

- [ ] README describes the user, business outcome, and operating boundary.
- [ ] Setup or preview commands are current and do not rely on private machine state.
- [ ] No real secrets, private user data, or machine-local state are tracked.
- [ ] Screenshots, demos, or sample outputs are safe to share publicly when the repository is public.
- [ ] Product-specific tests or smoke checks are documented before production use.

## Roadmap

- Tighten the fastest path from clone to useful demo.
- Add project-specific screenshots, sample outputs, or a short walkthrough where useful.
- Promote repeated manual steps into scripts, tests, or documented workflows.
- Keep security, privacy, and licensing boundaries explicit as the project evolves.

## Maintainer Notes

Maintained by [Tony Sheng](https://github.com/shengdabai). This README is written as a business-facing handoff: it should help a future collaborator, client, or reviewer understand why the repository exists, how to inspect it, and what must be true before it is reused or shipped.
