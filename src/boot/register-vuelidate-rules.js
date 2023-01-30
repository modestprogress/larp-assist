import { $rules } from 'src/validation';

export default ({ app }) => {
  app.config.globalProperties.$rules = $rules;
};
