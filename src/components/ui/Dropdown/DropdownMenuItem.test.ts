import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DropdownMenuItem from './DropdownMenuItem.vue';

describe('DropdownMenuItem', () => {
  it('renders correctly with default slot', () => {
    const wrapper = mount(DropdownMenuItem, {
      slots: {
        default: 'Menu Item',
      },
    });

    expect(wrapper.text()).toContain('Menu Item');
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('emits click event when clicked', async () => {
    const wrapper = mount(DropdownMenuItem);

    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('applies disabled attribute when disabled', () => {
    const wrapper = mount(DropdownMenuItem, {
      props: {
        disabled: true,
      },
    });

    const button = wrapper.find('button');
    expect(button.attributes('disabled')).toBeDefined();
  });
});
