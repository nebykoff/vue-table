import Vue from 'vue';
import Multiselect from 'vue-multiselect';
import App from './App.vue';
import store from './store';
import 'normalize.css';

import 'vue-multiselect/dist/vue-multiselect.min.css';

Vue.component('multiselect', Multiselect);

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
