import {
    ComponentEntity,
    Entity,
    entityKindSchemaValidator,
    KindValidator,
  } from '@backstage/catalog-model';
  import schema from '../schema/CustomComponent.schema.json';
  
  /**
   * Backstage catalog CustomComponent of kind Component Entity. This contains functionalities 
   * the Component is part of.
   *
   * @public
   */
  export type CustomComponent = ComponentEntity & {
    spec?: {
        functionalities?: Array<string>;
    }
  }

  const validator = entityKindSchemaValidator(schema);
  
  /**
   * Entity data validator for {@link CustomComponent}.
   *
   * @public
   */
  export const customComponentEntityValidator: KindValidator = {
    async check(data: Entity) {
      return validator(data) === data;
    },
  };
  
  /**
   * Typeguard for filtering entities and ensuring v1alpha1 entities
   * @public
   */
  export const isCustomComponentEntityV1alpha1 = (
    entity: Entity,
  ): entity is CustomComponent =>
    entity.apiVersion.startsWith('backstage.io') &&
    entity.kind === 'Component';