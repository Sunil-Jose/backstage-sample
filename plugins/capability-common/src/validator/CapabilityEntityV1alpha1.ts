import {
  Entity,
  entityKindSchemaValidator,
  KindValidator,
} from '@backstage/catalog-model';
import schema from '../schema/Capability.v1alpha1.schema.json';

/**
 * Backstage catalog Capability kind Entity. Functionalities are used by the Capability
 * plugin to group together Components to that are involved in make a capability possible.
 *
 * @public
 */
export interface CapabilityEntityV1alpha1 extends Entity {
  /**
   * The apiVersion string of the Capability.
   */
  apiVersion: 'capability.tw/v1alpha1';
  /**
   * The kind of the entity
   */
  kind: 'Capability';
  /**
   * The specification of the Capability Entity
   */
  spec: {
    /**
     * The owner entityRef of the CapabilityEntity
     */
    owner: string;

    /**
     * The components that are involved in implementing this capability
     */
    components?: Array<string>;

    /**
     * The platform to which this Capability belongs to
     */
    platform?: string;
    
    /**
     * The capability which is the parent of this
     */
    capability?: string;
  };
}

const validator = entityKindSchemaValidator(schema);

/**
 * Entity data validator for {@link CapabilityEntityV1alpha1}.
 *
 * @public
 */
export const capabilityEntityV1alpha1Validator: KindValidator = {
  async check(data: Entity) {
    return validator(data) === data;
  },
};

/**
 * Typeguard for filtering entities and ensuring v1alpha1 entities
 * @public
 */
export const isCapabilityEntityV1alpha1 = (
  entity: Entity,
): entity is CapabilityEntityV1alpha1 =>
  entity.apiVersion === 'capability.tw/v1alpha1' &&
  entity.kind === 'Capability';