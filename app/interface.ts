import { Binary } from "lucide-react";

export type Mode = 'numeric' | 'alphabetic' | 'alphanumeric';
export type ToolType = 'code-generator' | 'settings' | 'about';

export interface Tool {
    id: ToolType;
    name: string;
    icon: any;
    description: string;
}

export const TOOLS: Tool[] = [
    {
        id: 'code-generator',
        name: 'Code Generator',
        icon: Binary,
        description: 'Generate secure random strings'
    },
];