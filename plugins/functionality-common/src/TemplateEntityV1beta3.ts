import {
    Entity,
    entityKindSchemaValidator,
    KindValidator,
  } from '@backstage/catalog-model';
  import { JsonObject } from '@backstage/types';
  import schema from './Template.v1beta3.schema.json';
  
  /**
   * Backstage catalog Functionality kind Entity. Functionalities are used by the Functionality
   * plugin to create new entities, such as Components.
   *
   * @public
   */
  export interface FunctionalityEntityV1beta3 extends Entity {
    /**
     * The apiVersion string of the TaskSpec.
     */
    apiVersion: 'functionality.tw/v1beta3';
    /**
     * The kind of the entity
     */
    kind: 'Functionality';
    /**
     * The specification of the Functionality Entity
     */
    spec: {
      /**
       * The owner entityRef of the FunctionalityEntity
       */
      owner?: string;
    };
  }

  /**
   *  Access control properties for parts of a template.
   *
   * @public
   */
  export interface FunctionalityPermissionsV1beta3 extends JsonObject {
    tags?: string[];
  }
  
  const validator = entityKindSchemaValidator(schema);
  
  /**
   * Entity data validator for {@link FunctionalityEntityV1beta3}.
   *
   * @public
   */
  export const functionalityEntityV1beta3Validator: KindValidator = {
    // TODO(freben): Emulate the old KindValidator until we fix that type
    async check(data: Entity) {
      return validator(data) === data;
    },
  };
  
  /**
   * Typeguard for filtering entities and ensuring v1beta3 entities
   * @public
   */
  export const isFunctionalityEntityV1beta3 = (
    entity: Entity,
  ): entity is FunctionalityEntityV1beta3 =>
    entity.apiVersion === 'functionality.tw/v1beta3' &&
    entity.kind === 'Functionality';