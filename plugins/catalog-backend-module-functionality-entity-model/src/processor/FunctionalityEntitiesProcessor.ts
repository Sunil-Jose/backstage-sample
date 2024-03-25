import {
  Entity,
  getCompoundEntityRef,
  parseEntityRef,
  RELATION_OWNED_BY,
  RELATION_OWNER_OF,
  RELATION_PART_OF,
  RELATION_HAS_PART,
  RELATION_CHILD_OF,
  RELATION_PARENT_OF,
} from '@backstage/catalog-model';
import {
  CatalogProcessor,
  CatalogProcessorEmit,
  processingResult,
} from '@backstage/plugin-catalog-node';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  FunctionalityEntityV1alpha1,
  functionalityEntityV1alpha1Validator,
} from '@internal/backstage-plugin-functionality-common';

/**
 * Adds support for functionality specific entity kinds to the catalog.
 *
 * @public
 */
export class FunctionalityEntitiesProcessor implements CatalogProcessor {
  getProcessorName(): string {
    return 'FunctionalityEntitiesProcessor';
  }

  private readonly validators = [functionalityEntityV1alpha1Validator];

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
      entity.apiVersion === 'functionality.tw/v1alpha1' &&
      entity.kind === 'Functionality'
    ) {
      const functionality = entity as FunctionalityEntityV1alpha1;

      if (functionality.spec) {
        // Owner entity ref resolution
        const target = functionality.spec.owner;
        if (target) {
          const ownerEntityRef = parseEntityRef(target, {
            defaultKind: 'Group',
            defaultNamespace: selfRef.namespace,
          });
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

        // platform entity ref resolution
        const platform = functionality.spec.platform;
        if (platform) {
          const platformEntityRef = parseEntityRef(platform, {
            defaultKind: 'Platform',
            defaultNamespace: selfRef.namespace,
          });
          emit(
            processingResult.relation({
              source: selfRef,
              type: RELATION_CHILD_OF,
              target: {
                kind: platformEntityRef.kind,
                namespace: platformEntityRef.namespace,
                name: platformEntityRef.name,
              },
            })
          );
          emit(
            processingResult.relation({
              source: {
                kind: platformEntityRef.kind,
                namespace: platformEntityRef.namespace,
                name: platformEntityRef.name,
              },
              type: RELATION_PARENT_OF,
              target: selfRef,
            }),
          );
        }

        // functionality entity ref resolution
        const parentFunctionality = functionality.spec.functionality;
        if (parentFunctionality) {
          const parentFunctionalityEntityRef = parseEntityRef(parentFunctionality, {
            defaultKind: 'Functionality',
            defaultNamespace: selfRef.namespace,
          });
          emit(
            processingResult.relation({
              source: selfRef,
              type: RELATION_CHILD_OF,
              target: {
                kind: parentFunctionalityEntityRef.kind,
                namespace: parentFunctionalityEntityRef.namespace,
                name: parentFunctionalityEntityRef.name,
              },
            })
          );
          emit(
            processingResult.relation({
              source: {
                kind: parentFunctionalityEntityRef.kind,
                namespace: parentFunctionalityEntityRef.namespace,
                name: parentFunctionalityEntityRef.name,
              },
              type: RELATION_PARENT_OF,
              target: selfRef,
            }),
          );
        }
      }
    }
    return entity;
  }
}