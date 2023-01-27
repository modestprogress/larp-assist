// Vue
import { mount } from '@vue/test-utils';
import { Quasar } from 'quasar';

// Pinia
import { createTestingPinia } from '@pinia/testing';

// Vitest
import { test, expect, vi } from 'vitest';

// Ours
import MarketPage from 'src/pages/player/MarketPage.vue';
import { useItemsStore } from 'src/stores/items';
import { useMarketsStore } from 'src/stores/markets';
import { installFirebase } from 'test/vitest/install-firebase';

installFirebase();

const pinia = createTestingPinia({ createSpy: vi.fn() });

const item = {
  id: 'testitem',
  name: 'Test Item',
  description: 'Test Description',
};

const itemsStore = useItemsStore(pinia);
itemsStore.refresh = () => new Promise((resolve) => resolve());
itemsStore.items = [item];
itemsStore.getItem = () => item;

const market = {
  id: 'testmarket',
  name: 'Test Market',
  characterIds: Array<string>,
  currencyId: 'testcurrency',
  listings: [
    {
      itemId: 'testitem',
      available: 1,
      value: 1,
    },
  ],
};

const marketsStore = useMarketsStore(pinia);
marketsStore.getMarket = () => market;
marketsStore.refresh = () => new Promise((resolve) => resolve());

const wrapperFactory = () =>
  mount(MarketPage, {
    global: {
      plugins: [Quasar],
    },
  });

test('page renders', () => {
  const wrapper = wrapperFactory();

  expect(MarketPage).toBeTruthy();
  expect(wrapper.exists()).toBeTruthy();

  const html = wrapper.html();
  expect(html).toContain(market.name);
  expect(html).toBeTruthy();
});
