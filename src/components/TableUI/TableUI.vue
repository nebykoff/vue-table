<template>
  <div class="table-ui">
    <div class="table-ui__title">
      Table UI
    </div>
    <div class="table-ui__header">
      <div class="table-ui__sorting">
        Sorting by:
        <div class="product-props" v-if="initColumns">
          <button :class="['product-prop',
          col.id === sortBy ? 'active' : '', isHide(col.id) ? 'hide' : '']"
               v-for="col in initColumns" :key="col.id"
               @click="changeSort(col.id)">
            {{ col.title }}
          </button>
        </div>
      </div>
      <select :v-model="productsPerPage" @change="changeProductsPerPage">
        <option value="10">10 Per Page</option>
        <option value="15">15 Per Page</option>
        <option value="20">20 Per Page</option>
      </select>
      <Pagination :interval="startFrom + 1 + '-' + endInterval"
        :total="totalProducts"
        @next="nextPage()"
        @prev="prevPage()"
      />
    </div>
    <div class="table-ui__table" v-if="!loadError">
      <table>
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.id" :class="[!col.show ? 'hide' : '']">
              {{ col.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td v-for="col in columns" :key="col.id" :class="[!col.show ? 'hide' : '']">
              {{ product[col.name] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      Ошибка загрузки: {{ loadError }}
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { getProducts } from '@/api/request';
import 'array.prototype.move';
import Pagination from '@/components/Pagination/Pagination.vue';

export default {
  name: 'Table',
  components: {
    Pagination,
  },
  columns: [],
  created() {
    this.columns = [...this.initColumns];
    getProducts().then((products) => {
      this.loadProducts(products);
      this.updateProducts();
    }).catch((error) => {
      this.loadError = error.error;
    });
  },
  data() {
    return {
      loadError: '',
      products: [],
      productsPerPage: 10,
      startFrom: 0,
      sortBy: 1, // todo Сделать перебор до первого элемента с show = true при инициализации
      initColumns: [
        {
          id: 1,
          name: 'product',
          title: 'Product (100g serving)',
          show: true,
        },
        {
          id: 2,
          name: 'calories',
          title: 'Calories',
          show: true,
        },
        {
          id: 3,
          name: 'fat',
          title: 'Fat (g)',
          show: true,
        },
        {
          id: 4,
          name: 'carbs',
          title: 'Carbs (g)',
          show: true,
        },
        {
          id: 5,
          name: 'protein',
          title: 'Protein (g)',
          show: true,
        },
        {
          id: 6,
          name: 'iron',
          title: 'Iron (%)',
          show: true,
        },
      ],
    };
  },
  methods: {
    ...mapActions(
      { loadProducts: 'updateProducts' },
    ),
    changeSort(id) {
      this.sortBy = id;

      // Возвращаем на место первый элемент согласно его id
      this.columns.move(0, this.columns[0].id - 1);

      // Ищем положение в массиве колонки которую нужно переместить на первое место
      let colIndex;
      this.columns.forEach((col, index) => {
        if (col.id === id) {
          colIndex = index;
        }
      });
      // Перемещаем колонку на первое место
      this.columns.move(colIndex, 0);
    },
    isHide(id) {
      return !this.columns.filter((col) => col.id === id)[0].show;
    },
    prevPage() {
      if (this.startFrom - this.productsPerPage >= 0) {
        this.startFrom -= this.productsPerPage;
        this.updateProducts();
      } else if (this.startFrom - this.productsPerPage > this.productsPerPage * -1) {
        this.startFrom = 0;
        this.updateProducts();
      }
    },
    nextPage() {
      if (this.startFrom + this.productsPerPage < this.totalProducts) {
        this.startFrom += this.productsPerPage;
        this.updateProducts();
      }
    },
    updateProducts() {
      this.products = this.getProductsPiece(this.productsPerPage, this.startFrom);
    },
    changeProductsPerPage(evt) {
      this.productsPerPage = +evt.target.value;
      this.updateProducts();
    },
  },
  computed: {
    ...mapGetters([
      'totalProducts',
      'getProductsPiece',
    ]),
    endInterval() {
      if (this.startFrom + this.productsPerPage <= this.totalProducts) {
        return this.startFrom + this.productsPerPage;
      }
      return this.totalProducts;
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "TableUI";
</style>
