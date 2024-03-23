import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';

export const functionalityModuleFunctionalityEntityModel = createBackendModule({
  pluginId: 'functionality',
  moduleId: 'functionality-entity-model',
  register(reg) {
    reg.registerInit({
      deps: { logger: coreServices.logger },
      async init({ logger }) {
        logger.info('Hello World!');
      },
    });
  },
});
