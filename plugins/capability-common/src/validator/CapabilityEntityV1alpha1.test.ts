import { entityKindSchemaValidator } from '@backstage/catalog-model';
import type { CapabilityEntityV1alpha1 } from './CapabilityEntityV1alpha1';
import schema from '../schema/Capability.v1alpha1.schema.json';

const validator = entityKindSchemaValidator(schema);

describe('CapabilityEntityV1beta3Validator', () => {
  let entity: CapabilityEntityV1alpha1;

  beforeEach(() => {
    entity = {
      apiVersion: 'capability.tw/v1alpha1',
      kind: 'Capability',
      metadata: {
        name: 'test',
      },
      spec: {
        owner: 'team-b',
        platform: 'platformA',
        components: ['componentA'],
        capability: 'capabilityA',
      },
    };
  });

  it('happy path: accepts valid data', async () => {
    expect(validator(entity)).toBe(entity);
  });

  it('ignores unknown apiVersion', async () => {
    (entity as any).apiVersion = 'wrong.tw/v1beta0';
    expect(validator(entity)).toBe(false);
  });

  it('ignores unknown kind', async () => {
    (entity as any).kind = 'Wizard';
    expect(validator(entity)).toBe(false);
  });

  it('rejects missing spec', async () => {
    delete (entity as any).spec;
    expect(() => validator(entity)).toThrow(/spec/); 
  });

  it('rejects missing owner', async () => {
    delete (entity as any).spec.owner;
    expect(() => validator(entity)).toThrow(/owner/);
  });

  it('rejects empty owner', async () => {
    (entity as any).spec.owner = '';
    expect(() => validator(entity)).toThrow(/owner/);
  });

  it('rejects wrong type owner', async () => {
    (entity as any).spec.owner = 5;
    expect(() => validator(entity)).toThrow(/owner/);
  });

  it('accepts missing platform', async () => {
    delete (entity as any).spec.platform;
    expect(validator(entity)).toBe(entity);
  });

  it('rejects empty platform', async () => {
    (entity as any).spec.platform = '';
    expect(() => validator(entity)).toThrow(/platform/);
  });

  it('accepts missing capability', async () => {
    delete (entity as any).spec.capability;
    expect(validator(entity)).toBe(entity);
  });

  it('rejects empty capability', async () => {
    (entity as any).spec.capability = '';
    expect(() => validator(entity)).toThrow(/capability/);
  });

  it('accepts missing components', async () => {
    delete (entity as any).spec.components;
    expect(validator(entity)).toBe(entity);
  });

  it('rejects empty components', async () => {
    (entity as any).spec.components[0] = '';
    expect(() => validator(entity)).toThrow(/components/);
  });

  it('rejects empty components in the middle of the array', async () =>{
    (entity as any).spec.components[1] = '';
    expect(() => validator(entity)).toThrow(/components/);
  });
});