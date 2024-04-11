import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { capabilityPlugin, CapabilityViewPage } from '../src/plugin';

createDevApp()
  .registerPlugin(capabilityPlugin)
  .addPage({
    element: <CapabilityViewPage />,
    title: 'Root Page',
    path: '/capability',
  })
  .render();
