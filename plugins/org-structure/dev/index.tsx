import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { orgStructurePlugin, OrgStructurePage } from '../src/plugin';

createDevApp()
  .registerPlugin(orgStructurePlugin)
  .addPage({
    element: <OrgStructurePage />,
    title: 'Root Page',
    path: '/org-structure',
  })
  .render();
