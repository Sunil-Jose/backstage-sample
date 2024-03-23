import { FunctionalityEntityV1alpha1 } from '@internal/backstage-plugin-functionality-common';
import { FunctionalityEntitiesProcessor } from './FunctionalityEntitiesProcessor';

const mockLocation = { type: 'a', target: 'b' };
const mockEntity: FunctionalityEntityV1alpha1 = {
  apiVersion: 'functionality.tw/v1alpha1',
  kind: 'Functionality',
  metadata: { name: 'n' },
  spec: {
    owner: 'o',
    components: 'comp1'
  },
};

describe('FunctionalityEntitiesProcessor', () => {
  describe('validateEntityKind', () => {
    it('validates the entity kind', async () => {
      const processor = new FunctionalityEntitiesProcessor();

      await expect(processor.validateEntityKind(mockEntity)).resolves.toBe(
        true,
      );
      await expect(
        processor.validateEntityKind({
          ...mockEntity,
          apiVersion: 'backstage.io/v1beta3',
        }),
      ).resolves.toBe(false);
      await expect(
        processor.validateEntityKind({ ...mockEntity, kind: 'Component' }),
      ).resolves.toBe(false);
    });
  });

  describe('postProcessEntity', () => {
    it('generates relations for component entities', async () => {
      const processor = new FunctionalityEntitiesProcessor();

      const emit = jest.fn();

      await processor.postProcessEntity(mockEntity, mockLocation, emit);

      expect(emit).toHaveBeenCalledTimes(4);
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'o' },
          type: 'ownerOf',
          target: { kind: 'Functionality', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Functionality', namespace: 'default', name: 'n' },
          type: 'ownedBy',
          target: { kind: 'Group', namespace: 'default', name: 'o' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Component', namespace: 'default', name: 'comp1' },
          type: 'isPartOf',
          target: { kind: 'Functionality', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Functionality', namespace: 'default', name: 'n' },
          type: 'hasPartOf',
          target: { kind: 'Component', namespace: 'default', name: 'comp1' },
        },
      });
    });
  });
});