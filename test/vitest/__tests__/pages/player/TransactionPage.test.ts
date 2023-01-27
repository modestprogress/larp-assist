import { test, expect, describe, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { Quasar } from 'quasar';
import { createTestingPinia } from '@pinia/testing';

// Ours
import TransactionsPage from 'src/pages/player/TransactionsPage.vue';
import { useUserStore, getSignedOutUser } from 'src/stores/user';
import { useCurrenciesStore } from 'src/stores/currencies';
import { useTransactionsStore } from 'src/stores/transactions';
import { installFirebase } from 'test/vitest/install-firebase';

installFirebase();

const pinia = createTestingPinia({ createSpy: vi.fn() });

const userStore = useUserStore(pinia);
userStore.user = {
  ...getSignedOutUser(),
  isLoggedIn: true,
  id: 'testuser',
  characterId: 'charid',
};

const currency = {
  id: 'testcurrency',
  name: 'Test',
  characterIds: [userStore.user.id],
};

const currenciesStore = useCurrenciesStore(pinia);
currenciesStore.refresh = () => Promise.resolve();
currenciesStore.items = [];
currenciesStore.getCurrency = () => currency;

const transactionsStore = useTransactionsStore(pinia);
transactionsStore.refresh = () => new Promise((resolve) => resolve());
transactionsStore.items = [
  {
    id: 'testtransaction',
    currencyId: currency.id,
    characterId: userStore.user.id,
    amount: 1,
    notes: 'Test notes',
  },
];

const wrapperFactory = () =>
  mount(TransactionsPage, { global: { plugins: [Quasar] } });

test('page loads', async () => {
  expect(TransactionsPage).toBeTruthy();
  const wrapper = wrapperFactory();

  const html = wrapper.html();
  expect(html).toBeTruthy();
});
