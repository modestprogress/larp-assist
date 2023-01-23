import { test, expect, describe, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { Quasar } from 'quasar';
import { createTestingPinia } from '@pinia/testing';
import LibraryPage from 'src/pages/player/LibraryPage.vue';
import { useUserStore, getSignedOutUser } from 'src/stores/user';
import { useBooksStore } from 'src/stores/books';
import { installFirebase } from 'test/vitest/install-firebase';

installFirebase();

const pinia = createTestingPinia({ createSpy: vi.fn() });

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

test('propper books display', async () => {
  expect(LibraryPage).toBeTruthy();
  const wrapper = wrapperFactory();

  const html = wrapper.html();
  expect(html).toBeTruthy();
});
