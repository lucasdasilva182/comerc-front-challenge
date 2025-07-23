import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Button from '../ui/Button.vue';

describe('Button', () => {
  it('renders properly', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me',
      },
    });
    expect(wrapper.find('button').text()).toBe('Click me');
  });
});
