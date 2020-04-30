import Vue from 'vue';
import Vuex from 'vuex';
// import { getProducts, deleteProducts } from '@/api/request';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    products: [],
  },
  mutations: {
    updateProducts(state, products) {
      state.products = products;
    },
  },
  actions: {
    updateProducts({ commit }, products) {
      commit('updateProducts', products);
    },
  },
  modules: {
  },
});
