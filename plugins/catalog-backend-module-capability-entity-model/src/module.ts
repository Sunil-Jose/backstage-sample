import { createBackendModule } from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { CapabilityEntitiesProcessor, PlatformEntitiesProcessor } from './processor';

/**
 * Registers support for the capability specific entity model (e.g. the Capability
 * kind) to the catalog backend plugin.
 *
 * @public
 */
export const catalogModuleCapabilityEntityModel = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'capability-entity-model',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
      },
      async init({ catalog }) {
        catalog.addProcessor(new CapabilityEntitiesProcessor());
        catalog.addProcessor(new PlatformEntitiesProcessor());
      },
    });
  },
});
