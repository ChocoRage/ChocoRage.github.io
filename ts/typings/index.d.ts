/// <reference path="globals/react-dom/index.d.ts" />
/// <reference path="globals/react/index.d.ts" />
/// <reference path="../src/components/managers/GameManager.ts" />
/// <reference path="../src/components/views/BoardView.tsx" />

declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};