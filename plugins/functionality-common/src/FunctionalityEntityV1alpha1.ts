import {
  Entity,
  entityKindSchemaValidator,
  KindValidator,
} from '@backstage/catalog-model';
import schema from './Functionality.v1alpha1.schema.json';

/**
 * Backstage catalog Functionality kind Entity. Functionalities are used by the Functionality
 * plugin to create new entities, such as Components.
 *
 * @public
 */
export interface FunctionalityEntityV1alpha1 extends Entity {
  /**
   * The apiVersion string of the TaskSpec.
   */
  apiVersion: 'functionality.tw/v1alpha1';
  /**
   * The kind of the entity
   */
  kind: 'Functionality';
  /**
   * The specification of the Functionality Entity
   */
  spec?: {
    /**
     * The owner entityRef of the FunctionalityEntity
     */
    owner?: string;

    /**
     * The components that are involved in implementing this functionality
     */
    components?: string;
  };
}

const validator = entityKindSchemaValidator(schema);

/**
 * Entity data validator for {@link FunctionalityEntityV1alpha1}.
 *
 * @public
 */
export const functionalityEntityV1alpha1Validator: KindValidator = {
  async check(data: Entity) {
    return validator(data) === data;
  },
};

/**
 * Typeguard for filtering entities and ensuring v1alpha1 entities
 * @public
 */
export const isFunctionalityEntityV1alpha1 = (
  entity: Entity,
): entity is FunctionalityEntityV1alpha1 =>
  entity.apiVersion === 'functionality.tw/v1alpha1' &&
  entity.kind === 'Functionality';