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
          col.id === getSortingCol().id ? 'active' : '', isHide(col.id) ? 'hide' : '']"
               v-for="col in initColumns" :key="col.id"
               @click="changeSortCol(col.id)">
            {{ col.title }}
          </button>
        </div>
      </div>
      <button :disabled="!selectedProducts.length" @click="deleteProducts(selectedProducts)">
        Delete {{ selectedProducts.length ? `(${selectedProducts.length})` : ''}}
      </button>
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
      <DropDownList v-slot="slotProps" :columns="columns"
                    @onSelectAll="onSelectAllCols"
                    @colShowChanged="onColShowChanged">
        {{ slotProps.selectedColumns }} columns selected
      </DropDownList>
    </div>
    <div class="table-ui__table" v-if="!loadError">
      <table>
        <thead>
          <tr>
          <th>
            <Checkbox @change="selectAllProducts($event.target.checked)"/>
          </th>
            <th v-for="col in columns"
                :key="col.id"
                @click="onTableHeadClick(col.id)"
                :class="[!col.show ? 'hide' : '',
                col.id === getSortingCol().id ? 'sort' : '']">
              {{ col.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>
              <Checkbox
              @change="onProductRowClick(product.id)"
              :checked="isProductSelected(product.id) ? 'checked' : ''"/>
            </td>
            <td v-for="col in columns" :key="col.id"
              @click="onProductRowClick(product.id)"
              :class="[!col.show ? 'hide' : '']">
              {{ product[col.name] }}
            </td>
            <td>
              <button @click="deleteProducts([product.id], false)">delete</button>
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
import DropDownList from '@/components/Common/DropDownList/DropDownList.vue';
import Checkbox from '@/components/Common/Checkbox/Checkbox.vue';


export default {
  name: 'Table',
  components: {
    Pagination, DropDownList, Checkbox,
  },
  created() {
    this.columns = [...this.initColumns];
    getProducts().then((products) => {
      this.loadProducts(products);
      this.sort();
      this.updateProducts();
    }).catch((error) => {
      this.loadError = error.error;
    });
  },
  data() {
    return {
      loadError: '',
      products: [],
      columns: [],
      productsPerPage: 10,
      startFrom: 0,
      sortASC: true,
      selectedProducts: [],
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
      ['loadProducts', 'sortProducts', 'delProducts'],
    ),
    changeSortCol(id) {
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
      this.sort();
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
    onColShowChanged(col) {
      // eslint-disable-next-line
      col.show = !col.show;
      this.sort();
    },
    onSelectAllCols() {
      this.sort();
    },
    updateProducts() {
      this.products = this.getProductsPiece(this.productsPerPage, this.startFrom);
    },
    changeProductsPerPage(evt) {
      this.productsPerPage = +evt.target.value;
      this.updateProducts();
    },
    onTableHeadClick(id) {
      // Сортировка срабатывает только при клике по первой колонке
      if (id === this.getSortingCol().id) {
        this.sortASC = !this.sortASC;
        this.sort();
      }
    },
    // Ищет первую не скрытую колонку
    getSortingCol() {
      const sortingCol = this.columns.filter((col) => col.show)[0];

      // Если все скрыты - то выдаем первую
      if (!sortingCol) {
        return this.columns[0];
      }
      return sortingCol;
    },
    sort() {
      this.sortProducts({ colName: this.getSortingCol().name, sortASC: this.sortASC });
      this.updateProducts();
    },
    isProductSelected(id) {
      return this.selectedProducts.includes(id);
    },
    onProductRowClick(id) {
      if (this.isProductSelected(id)) {
        const index = this.selectedProducts.indexOf(id);
        this.selectedProducts.splice(index, 1);
      } else {
        this.selectedProducts.push(id);
      }
    },
    deleteProducts(ids, clearSelected = true) {
      this.delProducts(ids).then(() => {
        if (clearSelected) {
          this.selectedProducts = [];
        }
        this.updateProducts();
      }).catch((e) => {
        console.log(e);
      });
    },
    selectAllProducts(checked) {
      if (checked) {
        this.products.forEach((product) => {
          if (!this.selectedProducts.includes(product.id)) {
            this.selectedProducts.push(product.id);
          }
        });
      } else {
        this.products.forEach((product) => {
          if (this.selectedProducts.includes(product.id)) {
            const idx = this.selectedProducts.indexOf(product.id);
            this.selectedProducts.splice(idx, 1);
          }
        });
      }
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
