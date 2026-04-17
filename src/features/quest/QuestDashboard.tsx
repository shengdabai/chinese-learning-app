import React from 'react';
import { Trophy, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Quest } from '../../types';

interface QuestDashboardProps {
    quests: Quest[];
}

export const QuestDashboard: React.FC<QuestDashboardProps> = ({ quests }) => {
    return (
        <Card className="w-full bg-white/80 backdrop-blur-md border border-white/50 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                        <Trophy className="text-yellow-500" size={20} />
                        Daily Quests
                    </CardTitle>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        {quests.filter(q => q.completed).length}/{quests.length} Completed
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {quests.map((quest) => (
                        <div
                            key={quest.id}
                            className={`group flex items-center p-3 rounded-xl transition-all border ${quest.completed
                                    ? 'bg-green-50/50 border-green-100'
                                    : 'bg-slate-50 border-slate-100 hover:border-blue-100 hover:bg-white hover:shadow-sm'
                                }`}
                        >
                            <div className="flex-shrink-0 mr-3">
                                {quest.completed ? (
                                    <CheckCircle2 className="text-green-500 animate-in zoom-in spin-in-90 duration-300" size={22} />
                                ) : (
                                    <Circle className="text-slate-300 group-hover:text-blue-400 transition-colors" size={22} />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={`text-sm font-semibold truncate ${quest.completed ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-800'}`}>
                                    {quest.title}
                                </h4>
                                <p className="text-xs text-slate-500 truncate">{quest.description}</p>
                            </div>
                            <div className="flex-shrink-0 ml-3">
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${quest.completed
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-yellow-50 text-yellow-600 border border-yellow-100'
                                    }`}>
                                    +{quest.xpReward} XP
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
