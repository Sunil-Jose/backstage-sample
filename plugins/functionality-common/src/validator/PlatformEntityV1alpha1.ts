import {
  Entity,
  entityKindSchemaValidator,
  KindValidator,
} from '@backstage/catalog-model';
import schema from '../schema/Platform.v1alpha1.schema.json';

/**
 * Backstage catalog Platform kind Entity. Platforms are used by the Functionality
 * plugin to group functionalitiy entities.
 *
 * @public
 */
export interface PlatformEntityV1alpha1 extends Entity {
  /**
   * The apiVersion string of the TaskSpec.
   */
  apiVersion: 'functionality.tw/v1alpha1';
  /**
   * The kind of the entity
   */
  kind: 'Platform';
  /**
   * The specification of the Platform Entity
   */
  spec?: {
    /**
     * The owner entityRef of the Platform Entity
     */
    owner?: string;
  };
}

const validator = entityKindSchemaValidator(schema);

/**
 * Entity data validator for {@link PlatformEntityV1alpha1}.
 *
 * @public
 */
export const platformEntityV1alpha1Validator: KindValidator = {
  async check(data: Entity) {
    return validator(data) === data;
  },
};

/**
 * Typeguard for filtering entities and ensuring v1alpha1 entities
 * @public
 */
export const isPlatformEntityV1alpha1 = (
  entity: Entity,
): entity is PlatformEntityV1alpha1 =>
  entity.apiVersion === 'functionality.tw/v1alpha1' &&
  entity.kind === 'Platform';