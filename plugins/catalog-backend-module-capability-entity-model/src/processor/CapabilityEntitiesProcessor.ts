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
import {capabilityEntityV1alpha1Validator, CapabilityEntity} from "@personal/capability-common";


/**
 * Adds support for capability specific entity kinds to the catalog.
 *
 * @public
 */
export class CapabilityEntitiesProcessor implements CatalogProcessor {
  getProcessorName(): string {
    return 'CapabilityEntitiesProcessor';
  }

  private readonly validators = [capabilityEntityV1alpha1Validator];

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
      entity.kind === 'Capability'
    ) {
      const capability = entity as CapabilityEntity;

      if (capability.spec) {
        // Owner entity ref resolution
        const target = capability.spec.owner;
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
        const platform = capability.spec.platform;
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

        // capability entity ref resolution
        const parentCapability = capability.spec.capability;
        if (parentCapability) {
          const parentCapabilityEntityRef = parseEntityRef(parentCapability, {
            defaultKind: 'Capability',
            defaultNamespace: selfRef.namespace,
          });
          emit(
            processingResult.relation({
              source: selfRef,
              type: RELATION_CHILD_OF,
              target: {
                kind: parentCapabilityEntityRef.kind,
                namespace: parentCapabilityEntityRef.namespace,
                name: parentCapabilityEntityRef.name,
              },
            })
          );
          emit(
            processingResult.relation({
              source: {
                kind: parentCapabilityEntityRef.kind,
                namespace: parentCapabilityEntityRef.namespace,
                name: parentCapabilityEntityRef.name,
              },
              type: RELATION_PARENT_OF,
              target: selfRef,
            }),
          );
        }

        // components entity ref resolution
        const components = capability.spec.components;
        if (components) {
          for (const idx in components) {
            const componentEntityRef = parseEntityRef(components[idx], {
              defaultKind: 'Component',
              defaultNamespace: selfRef.namespace,
            });
            emit(
              processingResult.relation({
                source: selfRef,
                type: RELATION_HAS_PART,
                target: {
                  kind: componentEntityRef.kind,
                  namespace: componentEntityRef.namespace,
                  name: componentEntityRef.name,
                },
              })
            );
            emit(
              processingResult.relation({
                source: {
                  kind: componentEntityRef.kind,
                  namespace: componentEntityRef.namespace,
                  name: componentEntityRef.name,
                },
                type: RELATION_PART_OF,
                target: selfRef,
              }),
            );
          }
        }
      }
    }
    return entity;
  }
}