/**
 * Common functionalities for the scaffolder, to be shared between scaffolder and scaffolder-backend plugin
 *
 * @packageDocumentation
 */

export * from './TaskSpec';

export {
  templateEntityV1beta3Validator,
  isTemplateEntityV1beta3,
} from './TemplateEntityV1beta3';
export type {
  TemplatePresentationV1beta3,
  TemplateEntityV1beta3,
  TemplateEntityStepV1beta3,
  TemplateParametersV1beta3,
  TemplatePermissionsV1beta3,
  TemplateRecoveryV1beta3,
} from './TemplateEntityV1beta3';