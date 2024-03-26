import { CapabilityEntityV1alpha1 } from '@internal/backstage-plugin-capability-common';
import { CapabilityEntitiesProcessor } from './CapabilityEntitiesProcessor';

const mockLocation = { type: 'a', target: 'b' };
const mockEntity: CapabilityEntityV1alpha1 = {
  apiVersion: 'capability.tw/v1alpha1',
  kind: 'Capability',
  metadata: { name: 'n' },
  spec: {
    owner: 'o',
  },
};

describe('CapabilityEntitiesProcessor', () => {
  describe('validateEntityKind', () => {
    it('validates the entity kind', async () => {
      const processor = new CapabilityEntitiesProcessor();

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
      const processor = new CapabilityEntitiesProcessor();

      const emit = jest.fn();

      await processor.postProcessEntity(mockEntity, mockLocation, emit);

      expect(emit).toHaveBeenCalledTimes(4);
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'o' },
          type: 'ownerOf',
          target: { kind: 'Capability', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Capability', namespace: 'default', name: 'n' },
          type: 'ownedBy',
          target: { kind: 'Group', namespace: 'default', name: 'o' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Component', namespace: 'default', name: 'comp1' },
          type: 'isPartOf',
          target: { kind: 'Capability', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Capability', namespace: 'default', name: 'n' },
          type: 'hasPartOf',
          target: { kind: 'Component', namespace: 'default', name: 'comp1' },
        },
      });
    });
  });
});