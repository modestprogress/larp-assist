import { test, expect, describe, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { Quasar } from 'quasar';
import { createTestingPinia } from '@pinia/testing';

// Ours
import LibraryPage from 'src/pages/player/LibraryPage.vue';
import { useUserStore, getSignedOutUser } from 'src/stores/user';
import { useFilesStore } from 'src/stores/files';
import { useBooksStore } from 'src/stores/books';
import { installFirebase } from 'test/vitest/install-firebase';
import { File } from 'src/models';

installFirebase();

const pinia = createTestingPinia({ createSpy: vi.fn() });

const commonFile: File = {
  id: 'common1',
  code: 'common-code',
  bucket: 'bucket',
  path: 'path',
  url: 'http://example.com/common',
  common_name: 'This is a common name',
  common: true,
};

const hiddenFile: File = {
  id: 'file1',
  code: 'file1-code',
  bucket: 'bucket',
  path: 'path',
  url: 'http://example.com/blorp',
  common_name: commonFile.common_name + ' (NOT)',
  common: false,
};

const filesStore = useFilesStore(pinia);
filesStore.refresh = () => Promise.resolve();
filesStore.items = [commonFile, hiddenFile];

const userStore = useUserStore(pinia);
userStore.user = {
  ...getSignedOutUser(),
  isLoggedIn: true,
  id: 'test',
  characterId: 'charid',
};

const booksStore = useBooksStore();
booksStore.refresh = () => new Promise((resolve) => resolve());
booksStore.items = [];

const wrapperFactory = () =>
  mount(LibraryPage, { global: { plugins: [Quasar] } });

test('page loads', async () => {
  expect(LibraryPage).toBeTruthy();
  const wrapper = wrapperFactory();

  const html = wrapper.html();

  expect(html).toContain(commonFile.common_name);
  expect(html).not.toContain(hiddenFile.common_name);

  expect(html).toBeTruthy();
});
