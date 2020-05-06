import Vue from 'vue';
import VueSimpleAlert from 'vue-simple-alert';
import Multiselect from 'vue-multiselect';
import vueCustomScrollbar from 'vue-custom-scrollbar';
import App from './App.vue';
import store from './store';
import 'normalize.css';
import 'vue-multiselect/dist/vue-multiselect.min.css';

Vue.use(VueSimpleAlert);
Vue.component('multiselect', Multiselect);
Vue.component('vueCustomScrollbar', vueCustomScrollbar);

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
