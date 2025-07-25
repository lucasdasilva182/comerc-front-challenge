import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './routes';
import { configureVeeValidate } from './plugins/vee-validate';
//@ts-ignore
import VueTheMask from 'vue-the-mask';
import './style.css';

const app = createApp(App);

configureVeeValidate();

app.use(VueTheMask);
app.use(createPinia());
app.use(router);

app.mount('#app');
