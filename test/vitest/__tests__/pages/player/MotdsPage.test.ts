import { test, expect, describe, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { Quasar } from 'quasar';
import { installQuasar } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { createTestingPinia } from '@pinia/testing';

import PlayerMotdsPage from 'src/pages/player/MotdsPage.vue';

import { useUserStore, getSignedOutUser } from 'src/stores/user';
import { useMotdsStore } from 'src/stores/motds';
import { Motd } from 'src/models';

import { installFirebase } from 'test/vitest/install-firebase';

installQuasar();
installFirebase();

const pinia = createTestingPinia({ createSpy: vi.fn() });

const charId = 'test';
const userStore = useUserStore(pinia);
userStore.user = {
  ...getSignedOutUser(),
  isLoggedIn: true,
  id: 'test',
  characterId: charId,
};

const expectedMotds: Array<Motd> = [
  { id: 'a', characterId: charId, content: 'Character specific' },
  { id: 'b', characterId: '', content: 'Global' },
];

const unexpectedMotds: Array<Motd> = [
  { id: 'c', characterId: charId + 'other', content: 'Other character' },
];

const motdsStore = useMotdsStore();
motdsStore.refresh = () => new Promise((resolve) => resolve());
motdsStore.items = expectedMotds;

const wrapperFactory = () =>
  mount(PlayerMotdsPage, {
    global: {
      plugins: [Quasar],
    },
  });

test('propper motds display', () => {
  expect(PlayerMotdsPage).toBeTruthy();
  const wrapper = wrapperFactory();

  const html = wrapper.html();
  expectedMotds.forEach((motd) => {
    expect(html).toContain(motd.content);
  });

  unexpectedMotds.forEach((motd) => {
    expect(html).not.toContain(motd.content);
  });
});
