import { configure } from 'vee-validate';
import { localize } from '@vee-validate/i18n';
import pt from '@vee-validate/i18n/dist/locale/pt_BR.json';

export function configureVeeValidate() {
  configure({
    generateMessage: localize({ pt }),
  });
}
