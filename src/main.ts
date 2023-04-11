import { createApp } from 'vue';
import pinia from '@/stores/index';
import App from './App.vue';
import router from './router';
import { directive } from '@/directive/index';
import other from '@/utils/other';

import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ComponentHashMap from '@/utils/registerGlobalComponent'
import 'element-plus/dist/index.css';
import '@/theme/index.scss';
import '@/assets/global.css'

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

for (const key in ComponentHashMap) {
  app.component(key, ComponentHashMap[key])
}

directive(app);
other.elSvg(app);

app.use(pinia)
  .use(router)
  .use(ElementPlus)
  .mount('#app');
