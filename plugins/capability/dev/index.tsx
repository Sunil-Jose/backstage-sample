import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { capabilityPlugin, CapabilityPage } from '../src/plugin';

createDevApp()
  .registerPlugin(capabilityPlugin)
  .addPage({
    element: <CapabilityPage />,
    title: 'Root Page',
    path: '/capability',
  })
  .render();
