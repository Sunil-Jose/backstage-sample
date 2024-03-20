import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { functionalityPlugin, FunctionalityPage } from '../src/plugin';

createDevApp()
  .registerPlugin(functionalityPlugin)
  .addPage({
    element: <FunctionalityPage />,
    title: 'Root Page',
    path: '/functionality',
  })
  .render();
