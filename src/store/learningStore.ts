import { UserProfile, Quest } from '../types';

const STORAGE_KEY = 'lingualens_user_profile';

const DEFAULT_PROFILE: UserProfile = {
    xp: 0,
    streak: 1,
    level: 1,
    quests: [
        { id: '1', title: 'Daily Snap', description: 'Take a photo of any object', xpReward: 50, completed: false, type: 'snap', totalRequired: 1, progress: 0 },
        { id: '2', title: 'Word Hunter', description: 'Find a "Cup" (杯子)', xpReward: 100, completed: false, type: 'snap', targetCriteria: 'cup', totalRequired: 1, progress: 0 },
        { id: '3', title: 'Live Chat', description: 'Start a 1-minute session', xpReward: 150, completed: false, type: 'live', totalRequired: 1, progress: 0 },
        { id: '4', title: 'Red Hunter', description: 'Find something "红色" (red)', xpReward: 75, completed: false, type: 'snap', targetCriteria: 'red', totalRequired: 1, progress: 0 },
        { id: '5', title: 'Round Objects', description: 'Find something "圆的" (round)', xpReward: 75, completed: false, type: 'snap', targetCriteria: 'round', totalRequired: 1, progress: 0 },
        { id: '6', title: 'Dragon Seeker', description: 'Find something with "龙" (dragon) element', xpReward: 150, completed: false, type: 'snap', targetCriteria: 'dragon', totalRequired: 1, progress: 0 },
        { id: '7', title: 'Lucky Red', description: 'Find a "红包" (red envelope) or similar', xpReward: 120, completed: false, type: 'snap', targetCriteria: 'envelope', totalRequired: 1, progress: 0 },
        { id: '8', title: 'Snap Master', description: 'Snap 5 different objects', xpReward: 200, completed: false, type: 'snap', totalRequired: 5, progress: 0 },
    ]
};

export class LearningStore {
    static loadProfile(): UserProfile {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error("Failed to load profile", e);
        }
        return DEFAULT_PROFILE;
    }

    static saveProfile(profile: UserProfile): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        } catch (e) {
            console.error("Failed to save profile", e);
        }
    }

    static resetProfile(): UserProfile {
        LearningStore.saveProfile(DEFAULT_PROFILE);
        return DEFAULT_PROFILE;
    }
}
