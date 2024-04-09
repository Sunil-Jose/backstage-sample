import {
  Entity,
  getCompoundEntityRef,
  parseEntityRef,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
} from '@backstage/catalog-model';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  processingResult,
} from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import { PlatformEntity, platformEntityV1alpha1Validator } from '@internal/backstage-plugin-capability-common';

/**
 * Adds support for platform specific entity kinds to the catalog.
 *
 * @public
 */
export class PlatformEntitiesProcessor implements CatalogProcessor {
  getProcessorName(): string {
    return 'PlatformEntitiesProcessor';
  }

  private readonly validators = [platformEntityV1alpha1Validator];

  async validateEntityKind(entity: Entity): Promise<boolean> {
    for (const validator of this.validators) {
      if (await validator.check(entity)) {
        return true;
      }
    }

    return false;
  }

  async postProcessEntity(
    entity: Entity,
    _location: LocationSpec,
    emit: CatalogProcessorEmit,
  ): Promise<Entity> {
    const selfRef = getCompoundEntityRef(entity);

    if (
      entity.apiVersion === 'capability.tw/v1alpha1' &&
      entity.kind === 'Platform'
    ) {
      const platform = entity as PlatformEntity;

      if (platform.spec) {
        // Owner entity ref resolution
        const target = platform.spec.owner;
        if (target) {
          const ownerEntityRef = parseEntityRef(target);
          
          emit(
            processingResult.relation({
              source: selfRef,
              type: RELATION_OWNED_BY,
              target: {
                kind: ownerEntityRef.kind,
                namespace: ownerEntityRef.namespace,
                name: ownerEntityRef.name,
              },
            }),
          );
          emit(
            processingResult.relation({
              source: {
                kind: ownerEntityRef.kind,
                namespace: ownerEntityRef.namespace,
                name: ownerEntityRef.name,
              },
              type: RELATION_OWNER_OF,
              target: selfRef,
            }),
          );
        }
      }
    }

    return entity;
  }
}
