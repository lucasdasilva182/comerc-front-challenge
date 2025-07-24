import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './routes';
import { configureVeeValidate } from './plugins/vee-validate';
import './style.css';

const app = createApp(App);

configureVeeValidate();

app.use(createPinia());
app.use(router);

app.mount('#app');
