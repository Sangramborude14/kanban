export interface Task {
    id: string;
    title: string;
    description: string;
    columnId: string;
    createdAt: string;
}

export interface Column {
    id: string;
    title: string;
    tasks: Task[];
    boardId: string;
}
export interface kanban {
    id: string;
    title: string;
    columns: Column[];
}