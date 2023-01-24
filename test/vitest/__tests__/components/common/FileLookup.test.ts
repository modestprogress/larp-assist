import { test, expect, describe, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { Quasar } from 'quasar';
import { createTestingPinia } from '@pinia/testing';
import { installFirebase } from 'test/vitest/install-firebase';

// Ours
import FileLookup from 'src/components/common/FileLookup.vue';
import { useFilesStore } from 'src/stores/files';
import { File } from 'src/models';

installFirebase();

const pinia = createTestingPinia({ createSpy: vi.fn() });

const filesStore = useFilesStore(pinia);
filesStore.refresh = () => Promise.resolve();
filesStore.items = [
  {
    id: 'file1',
    code: 'file1-code',
    bucket: 'bucket',
    path: 'path',
    url: 'http://example.com/blorp',
    common_name: '',
    common: false,
  } as File,
];

const wrapperFactory = () =>
  mount(FileLookup, {
    props: {
      files: filesStore.items,
    },
    global: { plugins: [Quasar] },
  });

test('lookup does not blow anything up', async () => {
  expect(FileLookup).toBeTruthy();
  const wrapper = wrapperFactory();

  expect(wrapper.html()).toBeTruthy();
});
