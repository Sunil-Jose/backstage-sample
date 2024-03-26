import { createRouteRef, createSubRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 'capability',
});

export const createCapabilityPageRouteRef = createSubRouteRef({
  id: 'createCapability',
  parent: rootRouteRef,
  path: '/create',
});