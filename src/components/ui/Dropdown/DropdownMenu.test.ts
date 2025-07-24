import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import DropdownMenu from './DropdownMenu.vue';
import { UserRound } from 'lucide-vue-next';

describe('DropdownMenu', () => {
  const originalAddEventListener = document.addEventListener;
  const originalRemoveEventListener = document.removeEventListener;

  const mockAddEventListener = vi.fn();
  const mockRemoveEventListener = vi.fn();

  beforeEach(() => {
    document.addEventListener = mockAddEventListener;
    document.removeEventListener = mockRemoveEventListener;

    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
  });

  afterEach(() => {
    document.addEventListener = originalAddEventListener;
    document.removeEventListener = originalRemoveEventListener;
  });

  it('renders correctly with default props', () => {
    const wrapper = mount(DropdownMenu);

    expect(wrapper.exists()).toBe(true);

    const checkbox = wrapper.find('input[type="checkbox"]');
    expect(checkbox.exists()).toBe(true);

    const label = wrapper.find('label');
    expect(label.exists()).toBe(true);

    const userIcon = wrapper.findComponent(UserRound);
    expect(userIcon.exists()).toBe(true);
  });

  it('renders custom trigger slot', () => {
    const wrapper = mount(DropdownMenu, {
      slots: {
        trigger: '<span class="custom-trigger">Custom Trigger</span>',
      },
    });

    const customTrigger = wrapper.find('.custom-trigger');
    expect(customTrigger.exists()).toBe(true);
    expect(customTrigger.text()).toBe('Custom Trigger');
  });

  it('renders title slot', () => {
    const wrapper = mount(DropdownMenu, {
      slots: {
        title: '<div class="dropdown-title">Menu Title</div>',
      },
    });

    const title = wrapper.find('.dropdown-title');
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe('Menu Title');
  });

  it('renders default slots content', () => {
    const wrapper = mount(DropdownMenu, {
      slots: {
        default: '<li class="menu-item">Item 1</li><li class="menu-item">Item 2</li>',
      },
    });

    const menuItems = wrapper.findAll('.menu-item');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0].text()).toBe('Item 1');
    expect(menuItems[1].text()).toBe('Item 2');
  });

  it('toggles menu open/close when checkbox changes', async () => {
    const wrapper = mount(DropdownMenu);
    const checkbox = wrapper.find('input[type="checkbox"]');
    const nav = wrapper.find('nav');

    expect((checkbox.element as HTMLInputElement).checked).toBe(false);
    expect(nav.classes()).toContain('opacity-0');
    expect(nav.classes()).toContain('invisible');

    await checkbox.setValue(true);
    await nextTick();

    expect((checkbox.element as HTMLInputElement).checked).toBe(true);
    expect(nav.classes()).toContain('opacity-100');
    expect(nav.classes()).toContain('visible');
  });

  it('adds and removes event listeners on mount/unmount', () => {
    const wrapper = mount(DropdownMenu);

    expect(mockAddEventListener).toHaveBeenCalledWith('click', expect.any(Function));

    wrapper.unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith('click', expect.any(Function));
  });
});
