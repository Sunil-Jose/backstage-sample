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
  export interface TemplateEntityV1beta3 extends Entity {
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
   * Depends on how you designed your task you might tailor the behaviour for each of them.
   *
   * @public
   */
  export interface TemplateRecoveryV1beta3 extends JsonObject {
    /**
     *
     * none - not recover, let the task be marked as failed
     * startOver - do recover, start the execution of the task from the first step.
     *
     * @public
     */
    EXPERIMENTAL_strategy?: 'none' | 'startOver';
  }
  
  /**
   * The presentation of the template.
   *
   * @public
   */
  export interface TemplatePresentationV1beta3 extends JsonObject {
    /**
     * Overrides default buttons' text
     */
    buttonLabels?: {
      /**
       * The text for the button which leads to the previous template page
       */
      backButtonText?: string;
      /**
       * The text for the button which starts the execution of the template
       */
      createButtonText?: string;
      /**
       * The text for the button which opens template's review/summary
       */
      reviewButtonText?: string;
    };
  }
  
  /**
   * Step that is part of a Functionality Entity.
   *
   * @public
   */
  export interface TemplateEntityStepV1beta3 extends JsonObject {
    id?: string;
    name?: string;
    action: string;
    input?: JsonObject;
    if?: string | boolean;
    'backstage:permissions'?: TemplatePermissionsV1beta3;
  }
  
  /**
   * Parameter that is part of a Template Entity.
   *
   * @public
   */
  export interface TemplateParametersV1beta3 extends JsonObject {
    'backstage:permissions'?: TemplatePermissionsV1beta3;
  }
  
  /**
   *  Access control properties for parts of a template.
   *
   * @public
   */
  export interface TemplatePermissionsV1beta3 extends JsonObject {
    tags?: string[];
  }
  
  const validator = entityKindSchemaValidator(schema);
  
  /**
   * Entity data validator for {@link TemplateEntityV1beta3}.
   *
   * @public
   */
  export const templateEntityV1beta3Validator: KindValidator = {
    // TODO(freben): Emulate the old KindValidator until we fix that type
    async check(data: Entity) {
      return validator(data) === data;
    },
  };
  
  /**
   * Typeguard for filtering entities and ensuring v1beta3 entities
   * @public
   */
  export const isTemplateEntityV1beta3 = (
    entity: Entity,
  ): entity is TemplateEntityV1beta3 =>
    entity.apiVersion === 'functionality.tw/v1beta3' &&
    entity.kind === 'Functionality';