import { test, expect, describe, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { Quasar } from 'quasar';
import { installQuasar } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { createTestingPinia } from '@pinia/testing';
import BookLookup from 'src/components/common/BookLookup.vue';
import { useUserStore, getSignedOutUser } from 'src/stores/user';
import { useBooksStore } from 'src/stores/books';
import { Book } from 'src/models/books';
import { installFirebase } from 'test/vitest/install-firebase';

installQuasar();
installFirebase();

const pinia = createTestingPinia({ createSpy: vi.fn() });

const userStore = useUserStore(pinia);
userStore.user = {
  ...getSignedOutUser(),
  isLoggedIn: true,
  id: 'test',
  characterId: 'charid',
};

const expectedBook: Book = {
  id: 'a',
  author: 'test',
  name: 'Expected Book Title',
  description: 'Book description',
  location: 'Book location',
  code: 'Book Code',
};

const unexpectedBook: Book = { ...expectedBook };
Object.keys(expectedBook).map((key) => {
  unexpectedBook[key] = expectedBook[key] + ' (unexpected)';
});

const booksStore = useBooksStore();
booksStore.refresh = () => new Promise((resolve) => resolve());
booksStore.items = [expectedBook, unexpectedBook];

const wrapperFactory = () =>
  mount(BookLookup, { global: { plugins: [Quasar] } });

test('propper books display', async () => {
  expect(BookLookup).toBeTruthy();
  const wrapper = wrapperFactory();

  await wrapper.find('input').setValue(expectedBook.code);
  await wrapper.find('button').trigger('click');

  const html = wrapper.html();
  expect(html).toBeTruthy();
  expect(html).not.toContain('book not found');
  expect(html).toContain(expectedBook.name);
  expect(html).toContain(expectedBook.location);
  expect(html).toContain(expectedBook.description);

  expect(html).not.toContain(unexpectedBook.name);
  expect(html).not.toContain(unexpectedBook.location);
  expect(html).not.toContain(unexpectedBook.description);
});
