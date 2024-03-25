/**
 * Common functionalities for the functionality, to be shared between functionality and functionality-backend plugin
 *
 * @packageDocumentation
 */


export {
  functionalityEntityV1alpha1Validator,
  isFunctionalityEntityV1alpha1,
} from './validator/FunctionalityEntityV1alpha1';
export type {
  FunctionalityEntityV1alpha1,
} from './validator/FunctionalityEntityV1alpha1';

export { 
  platformEntityV1alpha1Validator,
  isPlatformEntityV1alpha1 
} from './validator/PlatformEntityV1alpha1';
export type { 
  PlatformEntityV1alpha1
} from './validator/PlatformEntityV1alpha1';

export {
  customComponentEntityValidator,
  isCustomComponentEntityV1alpha1 
} from './validator/CustomComponent';
export type { CustomComponent } from './validator/CustomComponent';