import type { Config } from "tailwindcss";
import sharedConfig from "@repo/ui/tailwind.config";

const config: Config = {
    ...sharedConfig,
    darkMode: "class",
    content: [
        ...sharedConfig.content, // mantém todos os paths do sharedConfig
        "./src/**/*.{js,ts,jsx,tsx,mdx}", // paths do projeto atual
        "../../packages/ui/src/**/*.{js,ts,jsx,tsx}", // paths do UI package
    ],
    theme: {
        ...sharedConfig.theme, // mantém keyframes, animações e cores
            colors: {
                'background': '#0B0E11',
                'highlight': '#005CFF',
                'secondary-accent': '#FFD700',
                'text-primary': '#E8E8E8',
                'shadow-card': '#15181D',
            },

    },
};

export default config;
