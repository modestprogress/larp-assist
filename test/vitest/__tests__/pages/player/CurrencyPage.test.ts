import { test, expect, describe, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { Quasar } from 'quasar';
import { createTestingPinia } from '@pinia/testing';

// Ours
import CurrencyPage from 'src/pages/player/CurrencyPage.vue';
import { useUserStore, getSignedOutUser } from 'src/stores/user';
import { useCurrenciesStore } from 'src/stores/currencies';
import { useMarketsStore } from 'src/stores/markets';
import { useCharactersStore } from 'src/stores/characters';
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

const currenciesStore = useCurrenciesStore(pinia);
currenciesStore.refresh = () => Promise.resolve();
currenciesStore.getCurrencyNames = () => new Map<string, string>();
currenciesStore.items = [];

const marketsStore = useMarketsStore(pinia);
marketsStore.refresh = () => new Promise((resolve) => resolve());
marketsStore.items = [];

const charactersStore = useCharactersStore(pinia);
charactersStore.refresh = () => new Promise((resolve) => resolve());
charactersStore.items = [];
charactersStore.getCharacterNames = () => new Map<string, string>();

const wrapperFactory = () =>
  mount(CurrencyPage, { global: { plugins: [Quasar] } });

test('page loads', async () => {
  expect(CurrencyPage).toBeTruthy();
  const wrapper = wrapperFactory();

  const html = wrapper.html();
  expect(html).toBeTruthy();
});
