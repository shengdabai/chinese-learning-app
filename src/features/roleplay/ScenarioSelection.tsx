import React from 'react';
import { SCENARIOS, Scenario } from './scenarios';
import { Card } from '../../components/ui/Card';
import { ChevronRight, Star } from 'lucide-react';

interface ScenarioSelectionProps {
    onSelect: (scenario: Scenario) => void;
}

export const ScenarioSelection: React.FC<ScenarioSelectionProps> = ({ onSelect }) => {
    return (
        <div className="grid grid-cols-1 gap-4 p-4">
            {SCENARIOS.map((scenario) => (
                <Card
                    key={scenario.id}
                    onClick={() => onSelect(scenario)}
                    className="group relative overflow-hidden cursor-pointer hover:shadow-lg transition-all active:scale-98 border-slate-200"
                >
                    <div className="flex items-center p-6">
                        <div className="text-4xl mr-5 bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center shadow-inner">
                            {scenario.emoji}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-lg text-slate-800">{scenario.title}</h3>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide
                  ${scenario.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                        scenario.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'}`}>
                                    {scenario.difficulty}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-blue-100 text-blue-700">
                                    {scenario.hskLevel}
                                </span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">{scenario.description}</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity -mr-2">
                            <div className="bg-slate-100 p-2 rounded-full text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-2xl transition-colors pointer-events-none" />
                </Card>
            ))}
        </div>
    );
};
