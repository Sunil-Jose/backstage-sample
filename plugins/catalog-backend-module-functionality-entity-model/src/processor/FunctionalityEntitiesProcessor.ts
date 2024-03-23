import {
    Entity,
    getCompoundEntityRef,
    parseEntityRef,
    RELATION_OWNED_BY,
    RELATION_OWNER_OF,
    RELATION_PART_OF,
    RELATION_HAS_PART,
  } from '@backstage/catalog-model';
  import {
    CatalogProcessor,
    CatalogProcessorEmit,
    processingResult,
  } from '@backstage/plugin-catalog-node';
  import { LocationSpec } from '@backstage/plugin-catalog-common';
  import {
    FunctionalityEntityV1beta3,
    functionalityEntityV1beta3Validator,
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
  
    private readonly validators = [functionalityEntityV1beta3Validator];
  
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
        const template = entity as FunctionalityEntityV1beta3;
  
        if (template.spec) {
          // Owner entity ref resolution
          const target = template.spec.owner;
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

          // components entity ref resolution
          const component = template.spec.components;
          if (component) {
            const componentEntityRef = parseEntityRef(component, {
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
  
      return entity;
    }
  }