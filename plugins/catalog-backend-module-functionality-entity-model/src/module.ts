import { createBackendModule } from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { FunctionalityEntitiesProcessor } from './processor';

/**
 * Registers support for the functionality specific entity model (e.g. the Functionality
 * kind) to the catalog backend plugin.
 *
 * @public
 */
export const catalogModuleFunctionalityEntityModel = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'functionality-entity-model',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
      },
      async init({ catalog }) {
        catalog.addProcessor(new FunctionalityEntitiesProcessor());
      },
    });
  },
});
