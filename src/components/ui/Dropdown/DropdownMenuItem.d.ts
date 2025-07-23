declare module '@/components/ui/Dropdown/DropdownMenuItem.vue' {
  import { DefineComponent } from 'vue';

  const component: DefineComponent<
    {
      disabled?: boolean;
    },
    {},
    {},
    {},
    {},
    {},
    {
      default: () => any;
      icon?: () => any;
    }
  >;

  export default component;
}
