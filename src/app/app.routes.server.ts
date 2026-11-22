import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Dynamic routes can't be prerendered without getPrerenderParams,
    // so they are rendered in the browser instead.
    path: 'groups/:groupId',
    renderMode: RenderMode.Client
  },
  {
    path: 'groups/:groupId/bookmarks',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
