import type { ReactNode } from "react";

interface GridBackgroundProps {
    children?: ReactNode;
}

export function GridBackgroundDemo({ children }: GridBackgroundProps) {
    return (
        <div className="relative min-h-screen w-full" style={{ backgroundColor: 'var(--color-bg)' }}>
            <div
                className="absolute inset-0"
                style={{
                    backgroundSize: '50px 50px',
                    backgroundImage: 'linear-gradient(to right, var(--color-bg-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--color-bg-grid) 1px, transparent 1px)',
                }}
            />
            {/* Máscara radial para efecto de difuminado */}
            <div 
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, var(--color-bg) 70%)',
                    pointerEvents: 'none'
                }}
            />
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}