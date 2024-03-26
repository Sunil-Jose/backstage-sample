import { PlatformEntityV1alpha1 } from "@internal/backstage-plugin-capability-common";
import { PlatformEntitiesProcessor } from "./PlatformEntitiesProcessor";

const mockLocation = { type: 'a', target: 'b' };
const mockEntity: PlatformEntityV1alpha1 = {
  apiVersion: 'capability.tw/v1alpha1',
  kind: 'Platform',
  metadata: { name: 'n' },
  spec: {
    owner: 'o',
  },
};

describe('PlatformEntitiesProcessor', () => {
  describe('validateEntityKind', () => {
    it('validates the entity kind', async () => {
      const processor = new PlatformEntitiesProcessor();

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
      const processor = new PlatformEntitiesProcessor();

      const emit = jest.fn();

      await processor.postProcessEntity(mockEntity, mockLocation, emit);

      expect(emit).toHaveBeenCalledTimes(2);
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'o' },
          type: 'ownerOf',
          target: { kind: 'Platform', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toHaveBeenCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Platofrm', namespace: 'default', name: 'n' },
          type: 'ownedBy',
          target: { kind: 'Group', namespace: 'default', name: 'o' },
        },
      });
    });
  });
});
