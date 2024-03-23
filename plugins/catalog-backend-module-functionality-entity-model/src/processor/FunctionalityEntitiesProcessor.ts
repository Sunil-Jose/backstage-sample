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
        entity.apiVersion === 'functionality.tw/v1beta3' &&
        entity.kind === 'Functionality'
      ) {
        const template = entity as FunctionalityEntityV1beta3;
  
        const target = template.spec.owner;
        if (target) {
          const targetRef = parseEntityRef(target, {
            defaultKind: 'Group',
            defaultNamespace: selfRef.namespace,
          });
          emit(
            processingResult.relation({
              source: selfRef,
              type: RELATION_OWNED_BY,
              target: {
                kind: targetRef.kind,
                namespace: targetRef.namespace,
                name: targetRef.name,
              },
            }),
          );
          emit(
            processingResult.relation({
              source: {
                kind: targetRef.kind,
                namespace: targetRef.namespace,
                name: targetRef.name,
              },
              type: RELATION_OWNER_OF,
              target: selfRef,
            }),
          );
        }
      }
  
      return entity;
    }
  }