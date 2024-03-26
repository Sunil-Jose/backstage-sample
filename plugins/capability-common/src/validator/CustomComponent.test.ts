import { entityKindSchemaValidator } from '@backstage/catalog-model';
import schema from '../schema/CustomComponent.schema.json';
import { CustomComponent } from './CustomComponent';

const validator = entityKindSchemaValidator(schema);

describe('CapabilityEntityV1beta3Validator', () => {
  let entity: CustomComponent;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1beta1',
      kind: 'Component',
      metadata: {
        name: 'test',
      },
      spec: {
        type: 'service',
        lifecycle: 'production',
        owner: 'team-b',
        capabilities: ['capabilityA'],
      },
    };
  });

  it('happy path: accepts valid data', async () => {
    expect(validator(entity)).toBe(entity);
  });

  it('accepts missing components', async () => {
    delete (entity as any).spec.capabilities;
    expect(validator(entity)).toBe(entity);
  });

  it('rejects empty components', async () => {
    (entity as any).spec.capabilities[0] = '';
    expect(() => validator(entity)).toThrow(/capabilities/);
  });

  it('rejects empty components in the middle of the array', async () =>{
    (entity as any).spec.capabilities[1] = '';
    expect(() => validator(entity)).toThrow(/capabilities/);
  });
});