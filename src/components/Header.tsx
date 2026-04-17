import React from 'react';
import { Languages } from 'lucide-react';
import { AppMode } from '../App';

interface HeaderProps {
    activeMode: AppMode;
    setActiveMode: (mode: AppMode) => void;
}

const NAV_ITEMS: { mode: AppMode; label: string }[] = [
    { mode: 'snap', label: 'Snap' },
    { mode: 'live', label: 'Live' },
    { mode: 'roleplay', label: 'Roleplay' },
    { mode: 'review', label: 'Review' },
];

export const Header: React.FC<HeaderProps> = ({ activeMode, setActiveMode }) => (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                    <Languages size={20} className="text-white" />
                </div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-100">
                    Lingua<span className="text-blue-400">Lens</span>
                </h1>
            </div>
            <nav className="flex bg-slate-800 rounded-lg p-1 items-center">
                {NAV_ITEMS.map(({ mode, label }) => (
                    <button
                        key={mode}
                        onClick={() => setActiveMode(mode)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                            activeMode === mode
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        {label}
                    </button>
                ))}
                <div className="w-px h-6 bg-slate-700 mx-1" />
                <button
                    onClick={() => setActiveMode('profile')}
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                        activeMode === 'profile'
                            ? 'ring-2 ring-blue-500'
                            : 'hover:ring-2 hover:ring-slate-600'
                    }`}
                >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-[10px] shadow-inner">
                        ME
                    </div>
                </button>
            </nav>
        </div>
    </header>
);
