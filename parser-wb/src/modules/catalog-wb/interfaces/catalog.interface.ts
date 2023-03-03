

export interface Catalog {
    id: number;
    name: string;
    nodes: [ParentCategory];
    query: string;
    rawQuery: string;
    shardKey: string;
    type: number;
}

export interface ParentCategory {
    id: number; 
    name: string;
    query: string; 
    shardKey: string; 
    rawQuery: string;
    type: number;
}

export interface IndetifiedParentCategory {
    name: string;
    id: number;
}