/**
 * Common functionalities for the scaffolder, to be shared between scaffolder and scaffolder-backend plugin
 *
 * @packageDocumentation
 */

export * from './TaskSpec';

export {
  functionalityEntityV1beta3Validator,
  isFunctionalityEntityV1beta3,
} from './TemplateEntityV1beta3';
export type {
  FunctionalityEntityV1beta3,
  FunctionalityPermissionsV1beta3 as TemplatePermissionsV1beta3,
} from './TemplateEntityV1beta3';