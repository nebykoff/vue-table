import Vue from 'vue';

import { MdButton, MdContent, MdTabs } from 'vue-material/dist/components';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

import App from './App.vue';
import store from './store';

Vue.use(MdButton);
Vue.use(MdContent);
Vue.use(MdTabs);

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
