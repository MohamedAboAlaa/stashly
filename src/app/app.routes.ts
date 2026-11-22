import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', redirectTo: 'dashboard', pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'groups',
        loadComponent: () => import('./features/groups/groups.component').then(m => m.GroupsComponent)
    },
    {
        path: 'bookmarks',
        loadComponent: () => import('./features/bookmarks/bookmarks.component').then(m => m.BookmarksComponent)
    },
    {
        path: 'groups/:groupId', redirectTo: 'groups/:groupId/bookmarks', pathMatch: 'full'
    },
    {
        path: 'groups/:groupId/bookmarks',
        loadComponent: () => import('./features/bookmarks/bookmarks.component').then(m => m.BookmarksComponent)
    },
    {
        path: '**',
        loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
    },
];
