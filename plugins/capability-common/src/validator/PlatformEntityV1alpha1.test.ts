import { entityKindSchemaValidator } from '@backstage/catalog-model';
import schema from '../schema/Platform.v1alpha1.schema.json';
import { PlatformEntityV1alpha1 } from './PlatformEntityV1alpha1';

const validator = entityKindSchemaValidator(schema);

describe('PlatformEntityV1beta3Validator', () => {
  let entity: PlatformEntityV1alpha1;

  beforeEach(() => {
    entity = {
      apiVersion: 'capability.tw/v1alpha1',
      kind: 'Platform',
      metadata: {
        name: 'test',
      },
      spec: {
        owner: 'team-b'
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
  })

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
});