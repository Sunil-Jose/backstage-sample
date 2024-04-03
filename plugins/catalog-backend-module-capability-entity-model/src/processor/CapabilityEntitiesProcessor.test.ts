import { CapabilityEntityV1alpha1 } from '@internal/backstage-plugin-capability-common';
import { CapabilityEntitiesProcessor } from './CapabilityEntitiesProcessor';

const mockLocation = { type: 'a', target: 'b' };
const mockEntity: CapabilityEntityV1alpha1 = {
  apiVersion: 'capability.tw/v1alpha1',
  kind: 'Capability',
  metadata: { name: 'cap1' },
  spec: {
    owner: 'group1',
    platform: 'platform1',
    components: ['comp1', 'comp2'],
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

      expect(emit).toHaveBeenCalledTimes(8);
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'group1' },
          type: 'ownerOf',
          target: { kind: 'Capability', namespace: 'default', name: 'cap1' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Capability', namespace: 'default', name: 'cap1' },
          type: 'ownedBy',
          target: { kind: 'Group', namespace: 'default', name: 'group1' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Platform', namespace: 'default', name: 'platform1' },
          type: 'isParentOf',
          target: { kind: 'Capability', namespace: 'default', name: 'cap1' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Capability', namespace: 'default', name: 'cap1' },
          type: 'isChildOf',
          target: { kind: 'Platform', namespace: 'default', name: 'platform1' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Component', namespace: 'default', name: 'comp1' },
          type: 'isPartOf',
          target: { kind: 'Capability', namespace: 'default', name: 'cap1' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Capability', namespace: 'default', name: 'cap1' },
          type: 'hasPartOf',
          target: { kind: 'Component', namespace: 'default', name: 'comp1' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Component', namespace: 'default', name: 'comp2' },
          type: 'isPartOf',
          target: { kind: 'Capability', namespace: 'default', name: 'cap1' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Capability', namespace: 'default', name: 'cap1' },
          type: 'hasPartOf',
          target: { kind: 'Component', namespace: 'default', name: 'comp2' },
        },
      });
    });
  });
});