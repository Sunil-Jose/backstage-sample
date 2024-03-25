import {
  Entity,
  RELATION_HAS_PART,
  RELATION_PART_OF,
  getCompoundEntityRef,
  parseEntityRef,
} from '@backstage/catalog-model';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  processingResult,
} from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import { CustomComponent, customComponentEntityValidator } from '@internal/backstage-plugin-functionality-common';

/**
 * Adds support for functionality in Component entity to the catalog.
 *
 * @public
 */
export class CustomComponentEntitiesProcessor implements CatalogProcessor {
  getProcessorName(): string {
    return 'CustomComponentEntitiesProcessor';
  }

  private readonly validators = [customComponentEntityValidator];

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
      entity.apiVersion.startsWith('backstage.io') &&
      entity.kind === "Component"
    ) {
      const component = entity as CustomComponent;
      // components entity ref resolution
      const functionalities = component.spec.functionalities;
      if (functionalities) {
        for (const idx in functionalities) {
          const functionalityEntityRef = parseEntityRef(functionalities[idx], {
            defaultKind: 'Functionality',
            defaultNamespace: selfRef.namespace,
          });
          console.log(functionalityEntityRef);
          emit(
            processingResult.relation({
              source: selfRef,
              type: RELATION_PART_OF,
              target: {
                kind: functionalityEntityRef.kind,
                namespace: functionalityEntityRef.namespace,
                name: functionalityEntityRef.name,
              },
            })
          );
          emit(
            processingResult.relation({
              source: {
                kind: functionalityEntityRef.kind,
                namespace: functionalityEntityRef.namespace,
                name: functionalityEntityRef.name,
              },
              type: RELATION_HAS_PART,
              target: selfRef,
            }),
          );
        }
      }
    }

    return entity;
  }
}
