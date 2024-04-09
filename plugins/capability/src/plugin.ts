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

export const CapabilityViewPage = capabilityPlugin.provide(
  createRoutableExtension({
    name: 'CapabilityPage',
    component: () =>
      import('./components/CapabilityDiagramPage').then(m => m.CapabilityDiagramPage),
    mountPoint: rootRouteRef,
  }),
);
