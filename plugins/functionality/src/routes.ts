import { createRouteRef, createSubRouteRef } from '@backstage/core-plugin-api';

export const rootRouteRef = createRouteRef({
  id: 'functionality',
});

export const createFunctionalityPageRouteRef = createSubRouteRef({
  id: 'createFunctionality',
  parent: rootRouteRef,
  path: '/create',
});