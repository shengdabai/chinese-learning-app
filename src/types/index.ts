export interface AnalysisResult {
    chinese: string;
    pinyin: string;
    english: string;
    sentence: string;
    sentencePinyin: string;
    sentenceEnglish: string;
    hskLevel?: number;
    funFact?: string;
    commonMistake?: string;
    radicals?: string[];
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    xpReward: number;
    completed: boolean;
    type: 'snap' | 'live' | 'quiz';
    targetCriteria?: string;
    progress?: number;
    totalRequired?: number;
}

export interface UserProfile {
    xp: number;
    streak: number;
    level: number;
    quests: Quest[];
}
