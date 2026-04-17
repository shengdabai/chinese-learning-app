import React, { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden selection:bg-blue-200">
            {/* Background decorations */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-3xl" />
                <div className="absolute top-[30%] -right-[10%] w-[40%] h-[60%] bg-indigo-200/20 rounded-full blur-3xl opacity-60" />
                <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] bg-purple-200/20 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                {children}
            </div>
        </div>
    );
};
