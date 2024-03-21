import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { createFunctionalityPageRouteRef, rootRouteRef } from './routes';

export const functionalityPlugin = createPlugin({
  id: 'functionality',
  routes: {
    root: rootRouteRef,
    create: createFunctionalityPageRouteRef,
  },
});

export const FunctionalityPage = functionalityPlugin.provide(
  createRoutableExtension({
    name: 'FunctionalityPage',
    component: () =>
      import('./components/MyPage').then(m => m.MyPage),
    mountPoint: rootRouteRef,
  }),
);
