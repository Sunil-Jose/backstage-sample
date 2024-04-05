import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const orgStructurePlugin = createPlugin({
  id: 'org-structure',
  routes: {
    root: rootRouteRef,
  },
});

export const OrgStructurePage = orgStructurePlugin.provide(
  createRoutableExtension({
    name: 'OrgStructurePage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
