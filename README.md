# Chinese Learning App (LinguaLens)

An immersive Chinese language learning application with AI-powered features for reading, speaking, and interactive learning.

## 🚀 Features

### 📸 Snap Mode
- Camera-powered object recognition
- Real-time Chinese text analysis
- AI-powered translation and definitions
- Tone visualization and pronunciation guides
- Spaced Repetition System (SRS) integration

### 🎥 Live Mode
- Real-time conversation practice
- Speech recognition and feedback
- Live video streaming
- Pronunciation analysis
- Interactive AI conversation partner

### 🎯 Quest System
- Daily learning quests
- XP and level progression
- Achievement tracking
- Goal-based motivation
- Progress visualization

### 🎭 Roleplay Scenarios
- Interactive conversation scenarios
- Real-world situation simulation
- Character-based dialogues
- Cultural context learning
- Dynamic storylines

### 📊 Profile & Progress
- Personalized learning dashboard
- XP and streak tracking
- Level progression system
- Learning analytics
- Achievement badges

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **UI Components**: Lucide React, Custom components
- **AI Integration**: Google GenAI
- **Audio Processing**: Web Audio API
- **State Management**: React Context API
- **Styling**: CSS Modules, Tailwind-inspired

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Chrome browser (for camera access)

### Installation

1. Clone the repository
```bash
git clone https://github.com/shengdabai/chinese-learning-app.git
cd chinese-learning-app
```

2. Install dependencies
```bash
npm install
```

3. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

4. Run the development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## 📱 Usage

### Basic Navigation
- **Snap Mode**: Take photos of objects to learn Chinese vocabulary
- **Live Mode**: Practice real-time conversations with AI
- **Quests**: Complete daily challenges to earn XP
- **Roleplay**: Engage in interactive scenarios
- **Profile**: View your progress and achievements

### AI Features
- Object recognition and translation
- Pronunciation analysis
- Conversation practice
- Contextual learning
- Personalized feedback

## 🎯 Learning Path

1. **Beginner**: Start with Snap Mode to build vocabulary
2. **Intermediate**: Practice with Live Mode conversations
3. **Advanced**: Engage in complex Roleplay scenarios
4. **Daily**: Complete Quests for consistent practice

## 📂 Project Structure

```
src/
├── components/          # UI Components
├── features/           # Feature modules
│   ├── snap/          # Camera mode
│   ├── live/          # Live conversation
│   ├── quest/         # Quest system
│   ├── roleplay/      # Roleplay scenarios
│   ├── profile/       # User profile
│   └── auth/          # Authentication
├── store/             # State management
├── types/             # TypeScript definitions
├── utils/             # Utility functions
└── config/            # Configuration files
```

## 🔧 Configuration

### AI Model Settings
- Snap Mode: `MODEL_STATIC`
- Live Mode: `MODEL_LIVE`
- Custom endpoints and API keys in `config/`

### Learning Preferences
- HSK level selection
- Pronunciation focus
- Vocabulary categories
- Difficulty settings

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 Deployment

The app can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

[License details to be added]

---

# 中文学习应用 (LinguaLens)

沉浸式中文学习应用，集成了AI功能，支持阅读、口语和互动学习。

## 🚀 主要功能

### 📸 拍照模式
- 相机物体识别
- 实时中文文本分析
- AI翻译和定义
- 声调可视化与发音指导
- 间隔重复系统（SRS）集成

### 🎥 直播模式
- 实时对话练习
- 语音识别和反馈
- 实时视频流
- 发音分析
- 互动式AI对话伙伴

### 🎯 任务系统
- 每日学习任务
- 积分和等级进度
- 成就追踪
- 目标驱动的激励
- 进度可视化

### 🎭 角色扮演场景
- 互动对话场景
- 真实情境模拟
- 基于角色的对话
- 文化背景学习
- 动态故事情节

### 📊 个人资料与进度
- 个性化学习仪表板
- 积分和连续天数追踪
- 等级进度系统
- 学习分析
- 成就徽章

## 🛠️ 技术栈

- **前端**: React 19, TypeScript
- **构建工具**: Vite
- **UI组件**: Lucide React, 自定义组件
- **AI集成**: Google GenAI
- **音频处理**: Web Audio API
- **状态管理**: React Context API
- **样式**: CSS模块, Tailwind风格

## 🚀 快速开始

### 前置要求
- Node.js 18+
- npm 或 yarn
- Chrome浏览器（用于相机访问）

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/shengdabai/chinese-learning-app.git
cd chinese-learning-app
```

2. 安装依赖
```bash
npm install
```

3. 在 [.env.local](.env.local) 中设置 `GEMINI_API_KEY` 为您的 Gemini API 密钥

4. 启动开发服务器
```bash
npm run dev
```

5. 构建生产版本
```bash
npm run build
```

## 📱 使用方法

### 基本导航
- **拍照模式**: 拍摄物体照片学习中文词汇
- **直播模式**: 与AI练习实时对话
- **任务**: 完成每日挑战获取积分
- **角色扮演**: 参与互动场景
- **个人资料**: 查看进度和成就

### AI功能
- 物体识别和翻译
- 发音分析
- 对话练习
- 上下文学习
- 个性化反馈

## 🎯 学习路径

1. **初学者**: 从拍照模式开始建立词汇量
2. **中级**: 通过直播模式练习对话
3. **高级**: 参与复杂角色扮演场景
4. **日常**: 完成任务保持练习连续性

## 📂 项目结构

```
src/
├── components/          # UI组件
├── features/           # 功能模块
│   ├── snap/          # 相机模式
│   ├── live/          # 直播对话
│   ├── quest/         # 任务系统
│   ├── roleplay/      # 角色扮演
│   ├── profile/       # 用户资料
│   └── auth/          # 身份验证
├── store/             # 状态管理
├── types/             # TypeScript定义
├── utils/             # 工具函数
└── config/            # 配置文件
```

## 🔧 配置

### AI模型设置
- 拍照模式: `MODEL_STATIC`
- 直播模式: `MODEL_LIVE`
- 自定义端点和API密钥在 `config/`

### 学习偏好
- HSK级别选择
- 发音重点
- 词汇类别
- 难度设置

## 🌐 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 部署

应用可以部署到：
- Vercel
- Netlify
- GitHub Pages
- 任何静态托管服务

## 🤝 贡献

1. Fork仓库
2. 创建功能分支
3. 进行修改
4. 如适用添加测试
5. 提交Pull Request

## 📄 许可证

[许可证详情待添加]
