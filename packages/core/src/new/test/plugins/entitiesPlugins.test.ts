/* eslint-disable max-classes-per-file */
import makeEntity from '@foscia/core/new/entities/makeEntity';
import makeComposable from '@foscia/core/new/entities/plugins/makeComposable';

describe('entities plugins', () => {
  it('should make entities with composable prerequisites', () => {
    const dummyComposable = makeComposable(class {
    }, (entity): entity is { id: string } => !!entity);

    const DummyEntityInValid = makeEntity(class {
      $type = 'invalid';

      $plugins = [dummyComposable];
    });

    const DummyEntityValid = makeEntity(class {
      $type = 'valid';

      $plugins = [dummyComposable];
    });
  });
});
