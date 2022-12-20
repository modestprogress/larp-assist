import fs from 'fs'

console.log('hi')

function makeTest(component: string) {
  return `import { installQuasar } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ${component} from 'components/${component}.vue';

installQuasar();

describe('${component} Component', () => {
  it('should mount component todos', () => {
    const wrapper = mount(${component}, {
      props: {},
    });
  });
});`
}

[
  'CharacterSelect',
  'CrudTable',
  'CurrencyCrudTable',
  'CurrencyDialogForm',
  'CurrencyTable',
  'DialogForm',
  'DivinationCrudTable',
  'DivinationDialogForm',
  'DivinationsList',
  'LoginForm',
  'MarketCrudTable',
  'MarketDialogForm',
  'MotdCrudTable',
  'MotdDialogForm',
  'MotdsList',
  'RegistrationForm',
  'TitledCard',
  'TransactionCrudTable',
  'TransactionDialogForm',
].forEach(async component => {
  const path = `test/vitest/__tests__/${component}.test.ts`
  const test = makeTest(component)
  await fs.writeFile(path, test, { flag: 'wx' }, () => {23});
})
