import Vue from 'vue';
import Vuex from 'vuex';
// import { getProducts, deleteProducts } from '@/api/request';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    products: [],
  },
  mutations: {
    loadProducts(state, products) {
      state.products = products;
    },
    sortProducts(state, { colName, sortASC }) {
      // Для чередования способа сортировка возростание/убывание
      let result = 1;
      if (!sortASC) {
        result *= -1;
      }

      // Сортировка
      state.products = state.products.sort((prev, next) => {
        if (prev[colName] < next[colName]) return result * -1;
        return result;
      });
    },
  },
  actions: {
    loadProducts({ commit }, products) {
      commit('loadProducts', products);
    },
    sortProducts({ commit }, { colName, sortASC }) {
      commit('sortProducts', { colName, sortASC });
    },
  },
  getters: {
    totalProducts(state) {
      return state.products.length;
    },
    getProductsPiece(state) {
      return (perPage, startFrom) => state.products.slice(startFrom, startFrom + perPage);
    },
  },
  modules: {
  },
});
