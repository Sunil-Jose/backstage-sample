import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { createCapabilityPageRouteRef, rootRouteRef } from './routes';

export const capabilityPlugin = createPlugin({
  id: 'capability',
  routes: {
    root: rootRouteRef,
    create: createCapabilityPageRouteRef,
  },
});

export const CapabilityPage = capabilityPlugin.provide(
  createRoutableExtension({
    name: 'CapabilityPage',
    component: () =>
      import('./components/MyPage').then(m => m.MyPage),
    mountPoint: rootRouteRef,
  }),
);
