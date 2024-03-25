import { entityKindSchemaValidator } from '@backstage/catalog-model';
import type { FunctionalityEntityV1alpha1 } from './FunctionalityEntityV1alpha1';
import schema from '../schema/Functionality.v1alpha1.schema.json';

const validator = entityKindSchemaValidator(schema);

describe('FunctionalityEntityV1beta3Validator', () => {
  let entity: FunctionalityEntityV1alpha1;

  beforeEach(() => {
    entity = {
      apiVersion: 'functionality.tw/v1alpha1',
      kind: 'Functionality',
      metadata: {
        name: 'test',
      },
      spec: {
        owner: 'team-b',
        platform: 'platformA',
        components: ['componentA'],
        functionality: 'functionalityA',
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

  it('accepts missing owner', async () => {
    delete (entity as any).spec.owner;
    expect(validator(entity)).toBe(entity);
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

  it('accepts missing functionality', async () => {
    delete (entity as any).spec.functionality;
    expect(validator(entity)).toBe(entity);
  });

  it('rejects empty functionality', async () => {
    (entity as any).spec.functionality = '';
    expect(() => validator(entity)).toThrow(/functionality/);
  });
});