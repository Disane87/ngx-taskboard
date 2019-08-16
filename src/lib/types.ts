
export interface CardItem {
    id: number;
    name: string;
    status?: string;
    color?: string;
    user?: string;
    priority?: number;
}

export interface CollapseState {
    name: string;
    collapsed: boolean;
}


