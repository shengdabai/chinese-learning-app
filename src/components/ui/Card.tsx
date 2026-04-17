import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
    className = '',
    variant = 'default',
    children,
    ...props
}) => {
    const variants = {
        default: 'bg-white border border-slate-100 shadow-sm',
        glass: 'bg-white/80 backdrop-blur-xl border border-white/50 shadow-glass',
        elevated: 'bg-white shadow-xl shadow-slate-200/50 border border-slate-50'
    };

    return (
        <div
            className={`rounded-2xl overflow-hidden ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
    <div className={`p-5 pb-3 ${className}`} {...props}>{children}</div>
);

export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({ className = '', children, ...props }) => (
    <h3 className={`text-lg font-semibold text-slate-900 ${className}`} {...props}>{children}</h3>
);

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
    <div className={`p-5 pt-0 ${className}`} {...props}>{children}</div>
);
