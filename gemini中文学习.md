# Gemini 中文学习 (LinguaLens) - Final Technical Blueprint (v5.0)

## 1. 项目愿景 (Project Vision)
**LinguaLens Web** 是一款为全球精英设计的沉浸式 AI 中文私教。它不仅教授语言，更通过实时音视频交互、全源素材解析（YouTube/PDF）和智能商务模拟，帮助用户跨越文化门槛。

## 2. 核心技术决策汇总 (Core Technical Decisions)

| 维度 | 最终方案 (Final Decision) | 核心细节 |
| :--- | :--- | :--- |
| **部署环境** | **GCP / Firebase (Hong Kong)** | 低延迟响应全球用户（尤其是亚洲与东南亚周边）。 |
| **音频模式** | **Always-on (Full Duplex)** | 模拟真实对话，支持浏览器原生 AEC 回声消除。 |
| **视频素材** | **异步预处理 (Asynchronous)** | 1h 视频等待 1-2 分钟生成课件，保证交互流畅性。 |
| **AI 介入** | **软提示模式 (Soft Coaching)** | 侧边栏实时同步纠错；仅在连续 3 次严重发音错误时才开口打断。 |
| **API 安全** | **Node.js 后端代理 (Proxy)** | 保护 Gemini 密钥，进行权限校验。 |

## 3. 功能模块深度设计 (Feature Modules)

### 3.1 异步内容解析流 (Content Pipeline)
1.  **输入**: YouTube URL / PDF / Word。
2.  **提取**: 服务端通过 `yt-dlp` 获取音频，并行分块传给 **Whisper STT**。
3.  **处理**: Gemini Flash 根据识别文本，自动生成：
    -   核心生词卡 (Audio included)。
    -   文化背景解释。
    -   模拟对话脚本。
4.  **就绪**: 1-2 分钟后，Firebase Cloud Messaging 推送 "Lesson Ready"。

### 3.2 智能教练逻辑 (Coach Logic)
*   **观测期**: 持续分析用户的音调曲线与文本匹配度。
*   **侧边栏反馈**: 实时反馈用户的 Tone (如：*Tone 2 was slightly flat*)。
*   **触发式教学**: 
    -   *If ErrorCount >= 3*: AI 暂停扮演 "张总"，变回 "老师" 模式，进入 **Cheat Mode (单音节练习)**。
    -   *Success*: 自动回到商务对话。

## 4. 商业模式与计费 (Billing)
- **Stripe 集成**: 充值换点数。
- **动态消耗**: 
    - 消耗点数与 AI 处理时长挂钩，不仅覆盖 API 成本，还包含增值溢价。
    - 示例：$10 充值可支持约 2 小时的深度实时陪练。

## 5. 开发里程碑 (MVP Milestones)
1.  **Phase 1 (Week 1)**: 前后端工程化脚手架，部署至 HK 区域。
2.  **Phase 2 (Week 2)**: 实现 Gemini Live + Whisper 基础流。
3.  **Phase 3 (Week 3)**: 完成 Sidebar 软提示 UI 与 Cheat Mode 逻辑。
4.  **Phase 4 (Week 4)**: Firebase 进度同步与 Stripe 测试网对接。

---
**Conclusion**: 方案已达到 "Production-Ready" 级别。
