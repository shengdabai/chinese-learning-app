import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { SnapMode } from './features/snap/SnapMode';
import { LiveMode } from './features/live/LiveMode';
import { QuestDashboard } from './features/quest/QuestDashboard';
import { ScenarioSelection } from './features/roleplay/ScenarioSelection';
import { RoleplaySession } from './features/roleplay/RoleplaySession';
import { ProfilePage } from './features/profile/ProfilePage';
import { SRSReviewPage } from './features/srs/SRSReviewPage';
import { AuthPage } from './features/auth/AuthPage';
import { useAuth } from './features/auth/useAuth';
import { SCENARIOS, Scenario } from './features/roleplay/scenarios';
import { UserProfile } from './types';

import { LearningStore } from './store/learningStore';

export type AppMode = 'snap' | 'live' | 'roleplay' | 'review' | 'profile';

const App = () => {
    const { user, isLoading, login, register, logout } = useAuth();
    const [activeMode, setActiveMode] = useState<AppMode>('snap');
    const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile>(() => LearningStore.loadProfile());

    // Persist state whenever userProfile changes
    useEffect(() => {
        LearningStore.saveProfile(userProfile);
    }, [userProfile]);

    const handleQuestUpdate = (type: 'snap' | 'live', value?: string) => {
        setUserProfile(prev => {
            let xpGained = 0;
            const updatedQuests = prev.quests.map(q => {
                if (q.completed) return q;

                let newProgress = q.progress || 0;
                let completed = false;

                if (q.type === type) {
                    if (type === 'snap') {
                        if (!q.targetCriteria) {
                            newProgress += 1;
                        } else if (value && value.toLowerCase().includes(q.targetCriteria.toLowerCase())) {
                            newProgress += 1;
                        }
                    } else if (type === 'live') {
                        newProgress += 1;
                    }
                }

                if (newProgress >= (q.totalRequired || 1)) {
                    newProgress = q.totalRequired || 1;
                    completed = true;
                    xpGained += q.xpReward;
                }

                return { ...q, progress: newProgress, completed };
            });

            return {
                ...prev,
                xp: prev.xp + xpGained,
                quests: updatedQuests
            };
        });
    };

    const renderContent = () => {
        switch (activeMode) {
            case 'snap':
                return <SnapMode onSnapComplete={(detected) => handleQuestUpdate('snap', detected)} />;
            case 'live':
                return <LiveMode onSessionStart={() => handleQuestUpdate('live')} />;
            case 'roleplay':
                if (activeScenario) {
                    return <RoleplaySession scenario={activeScenario} onExit={() => setActiveScenario(null)} />;
                }
                return <ScenarioSelection onSelect={setActiveScenario} />;
            case 'review':
                return <SRSReviewPage />;
            case 'profile':
                return <ProfilePage profile={userProfile} onLogout={logout} username={user?.username} />;
            default:
                return <SnapMode />;
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-slate-400 text-sm">Loading...</div>
                </div>
            </Layout>
        );
    }

    // Show auth page if not logged in
    if (!user) {
        return <AuthPage onLogin={login} onRegister={register} />;
    }

    return (
        <Layout>
            <Header
                activeMode={activeMode}
                setActiveMode={(mode) => {
                    setActiveMode(mode);
                    if (mode !== 'roleplay') setActiveScenario(null);
                }}
            />

            {activeMode !== 'roleplay' && activeMode !== 'profile' && activeMode !== 'review' && (
                <div className="container mx-auto max-w-lg px-4 pt-4">
                    <div className="flex items-center justify-between mb-4 bg-white/60 p-3 rounded-xl backdrop-blur-sm border border-white/40">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Current Level</span>
                            <span className="text-xl font-bold text-slate-800">Lvl {userProfile.level}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total XP</span>
                            <span className="text-xl font-bold text-blue-600">{userProfile.xp}</span>
                        </div>
                    </div>
                    <QuestDashboard quests={userProfile.quests} />
                </div>
            )}

            <main className="flex-1 relative flex flex-col mt-4">
                {renderContent()}
            </main>
        </Layout>
    );
};

export default App;
