import * as methods from '@vuelidate/validators';

const messages = {
  required: 'Field is required',
};

const getMsg = (key) => messages[key] || 'Invalid field.';

export const $rules = {
  is(value, message = getMsg('is')) {
    return (val) => {
      let result;
      switch (typeof value) {
        case 'string':
          result = String(val) === value;
          break;
        case 'number':
          result = Number(val) === value;
          break;
        default:
          result = val === value;
      }
      return result || message;
    };
  },
  required(message = getMsg('required')) {
    return (val) => methods.required.$validator(val) || message;
  },
  requiredIf(ref, message = getMsg('requiredIf')) {
    return (val) => methods.requiredIf(ref).$validator(val) || message;
  },
  requiredUnless(ref, message = getMsg('requiredUnless')) {
    return (val) => methods.requiredUnless(ref).$validator(val) || message;
  },
  minLength(length, message = getMsg('minLength')) {
    return (val) => methods.minLength(length).$validator(val) || message;
  },
  maxLength(length, message = getMsg('maxLength')) {
    return (val) => methods.maxLength(length).$validator(val) || message;
  },
  minValue(value, message = getMsg('minValue')) {
    return (val) => methods.minValue(value).$validator(val) || message;
  },
  maxValue(value, message = getMsg('maxValue')) {
    return (val) => methods.maxValue(value).$validator(val) || message;
  },
  between(min, max, message = getMsg('between')) {
    return (val) => methods.between(min, max).$validator(val) || message;
  },
  alpha(message = getMsg('alpha')) {
    return (val) => methods.alpha.$validator(val) || message;
  },
  alphaNum(message = getMsg('alphaNum')) {
    return (val) => methods.alphaNum.$validator(val) || message;
  },
  numeric(message = getMsg('numeric')) {
    return (val) => methods.numeric.$validator(val) || message;
  },
  integer(message = getMsg('integer')) {
    return (val) => methods.integer.$validator(val) || message;
  },
  decimal(message = getMsg('decimal')) {
    return (val) => methods.decimal.$validator(val) || message;
  },
  email(message = getMsg('email')) {
    return (val) => methods.email.$validator(val) || message;
  },
  ipAddress(message = getMsg('ipAddress')) {
    return (val) => methods.ipAddress.$validator(val) || message;
  },
  macAddress(separator = ':', message = getMsg('macAddress')) {
    return (val) => methods.macAddress.$validator(separator)(val) || message;
  },
  url(message = getMsg('url')) {
    return (val) => methods.url.$validator(val) || message;
  },
  or(...args) {
    let message = false;
    if (typeof args[args.length - 1] === 'string') {
      message = args.pop();
    }
    return (val) => methods.or(...args).$validator(val) || message;
  },
  and(...args) {
    let message = false;
    if (typeof args[args.length - 1] === 'string') {
      message = args.pop();
    }
    return (val) => methods.and(...args).$validator(val) || message;
  },
  not(rule, message = false) {
    return (val) => methods.not(rule).$validator(val) || message;
  },
  sameAs(locator, message = getMsg('sameAs')) {
    return (val) => val == locator || message;
  },
};
