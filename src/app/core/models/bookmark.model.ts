export type BookmarkStatus = 'FINISHED' | 'PENDING';
export type VisitStatus = 'VISITED' | 'UNVISITED';

export interface Group {
    id?: string | number,
    title: string,
    createdAt?: string,
    description: string,
}

export interface Bookmark {
    id?: string | number,
    title: string,
    createdAt?: string,
    url: string,
    status: BookmarkStatus,
    groupId: number | string,
    visitStatus: VisitStatus,
}