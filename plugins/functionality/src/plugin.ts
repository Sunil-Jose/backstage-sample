import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const functionalityPlugin = createPlugin({
  id: 'functionality',
  routes: {
    root: rootRouteRef,
  },
});

export const FunctionalityPage = functionalityPlugin.provide(
  createRoutableExtension({
    name: 'FunctionalityPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
