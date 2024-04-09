/**
 * Common capabilities for the capability, to be shared between capability and capability-backend plugin
 *
 * @packageDocumentation
 */


export {
  capabilityEntityV1alpha1Validator,
  isCapabilityEntityV1alpha1,
} from './validator/CapabilityEntityV1alpha1';
export type {
  CapabilityEntityV1alpha1 as Capability,
} from './validator/CapabilityEntityV1alpha1';

export { 
  platformEntityV1alpha1Validator,
  isPlatformEntityV1alpha1 
} from './validator/PlatformEntityV1alpha1';
export type { 
  PlatformEntityV1alpha1 as Platform
} from './validator/PlatformEntityV1alpha1';
