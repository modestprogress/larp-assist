import { test, expect, describe, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { Quasar } from 'quasar';
import FileLookup from 'src/components/common/FileLookup.vue';

const wrapperFactory = () =>
  mount(FileLookup, { global: { plugins: [Quasar] } });

test('lookup does not blow anything up', async () => {
  expect(FileLookup).toBeTruthy();
  const wrapper = wrapperFactory();

  expect(wrapper.html()).toBeTruthy();
});
