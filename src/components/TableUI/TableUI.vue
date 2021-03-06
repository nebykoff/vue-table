<template>
  <div class="table-ui">
    <div class="table-ui__title">
      Table UI
    </div>
    <div class="table-ui__header">
      <div class="table-ui__sorting">
        <strong>Sorting by:</strong>
        <div class="product-props" v-if="initColumns">
          <Button :class="['product-prop',
          col.id === getSortingCol().id ? 'active' : '', isColHide(col.id) ? 'hide' : '']"
               v-for="col in initColumns" :key="col.id"
               @click="changeSortCol(col.id)">
            {{ col.title }}
          </Button>
        </div>
      </div>
      <div class="table-ui__actions">
        <Button :disabled="!selectedProducts.length"
                @click="onDelete($event.target, selectedProducts)">
          Delete {{ selectedProducts.length ? `(${selectedProducts.length})` : ''}}
        </Button>
        <multiselect v-model="selectedByDefault" :options="pagesSelectOptions"
                     label="name"
                     placeholder="Select one"
                     :searchable="false"
                     :allow-empty="false"
                     :showLabels="false"
                     @select="changeProductsPerPage"
        ></multiselect>
        <Pagination :interval="startFrom + 1 + '-' + endInterval"
          :total="totalProducts"
          :first="isFirstPage"
          :last="isLastPage"
          @next="nextPage()"
          @prev="prevPage()"
        />
        <DropDownList v-slot="slotProps" :columns="columns"
                      @onSelectAll="onSelectAllCols"
                      @colShowChanged="onColShowChanged">
          {{ slotProps.selectedColumns }} columns selected
        </DropDownList>
      </div>
    </div>
    <div class="table-ui__table" v-if="!loadError">
      <table>
        <thead>
          <tr>
            <th>
              <Checkbox @change="selectAllProducts($event.target.checked)"/>
            </th>
            <th v-for="(col, idx) in columns"
                :key="col.id"
                @click="onTableHeadClick(col.id)"
                :class="[!col.show ? 'hide' : '',
                col.id === getSortingCol().id ? 'sort' : '']">
              <div>
                {{ col.title }}
                <img v-if="!idx" src="@/assets/img/arrow-up.svg" alt=""
                     :class="[!sortASC ? 'rotate180' : '']">
              </div>
            </th>
            <th>
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
              <Button class="button--del"
                      @click="onDelete($event.target, [product.id])">
                <img  src="@/assets/img/rubbish-bin.png"> delete
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
      <ConfirmBox :params="confirmBoxParams" v-show="confirmBoxParams.show"
                  @onDeleteConfirmed="onDeleteConfirmed">
        Are you sure you want to <strong>delete item</strong>?
      </ConfirmBox>
    </div>
    <div v-else>
      Ошибка загрузки: {{ loadError }}
    </div>
    <div class="loader" v-show="loading">
      <img src="@/assets/img/loader.svg" alt="">
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
import ConfirmBox from '@/components/Common/ConfirmBox/ConfirmBox.vue';
import Button from '@/components/Common/Button/Button.vue';
import Multiselect from 'vue-multiselect';

export default {
  name: 'Table',
  components: {
    Button,
    ConfirmBox,
    Pagination,
    DropDownList,
    Checkbox,
    Multiselect,
  },
  created() {
    this.columns = [...this.initColumns];
    this.loading = true;
    getProducts().then((products) => {
      this.loadProducts(products);
      this.sort();
      this.updateProducts();
    }).catch((error) => {
      this.loadError = error.error;
    }).finally(() => {
      this.loading = false;
    });
  },
  data() {
    return {
      loading: false,
      loadError: '',
      products: [],
      columns: [],
      productsPerPage: 10,
      startFrom: 0,
      sortASC: true,
      selectedProducts: [],
      confirmBoxParams: {
        show: false,
        parentRect: null,
      },
      productsToDelete: [],
      pagesSelectOptions: [
        {
          name: '10 Per Page',
          pages: 10,
        },
        {
          name: '15 Per Page',
          pages: 15,
        },
        {
          name: '20 Per Page',
          pages: 20,
        },
      ],
      selectedByDefault: {
        name: '10 Per Page',
        pages: 10,
      },
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
    isColHide(id) {
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
    changeProductsPerPage(selected) {
      this.productsPerPage = +selected.pages;
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
    deleteProducts(ids) {
      this.loading = true;
      this.delProducts(ids).then(() => {
        if (ids.length === 1) {
          const delProdIndex = this.selectedProducts.indexOf(ids[0]);
          this.selectedProducts.splice(delProdIndex, 1);
        } else {
          this.selectedProducts = [];
        }

        this.updateProducts();
      }).catch((e) => {
        this.$alert(e.toString());
      }).finally(() => {
        this.loading = false;
      });
    },
    onDelete(button, ids) {
      this.productsToDelete = ids;
      this.confirmBoxParams.parentRect = button.getBoundingClientRect();
      this.confirmBoxParams.show = true;
    },
    onDeleteConfirmed() {
      this.deleteProducts(this.productsToDelete);
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
    isFirstPage() {
      return this.startFrom === 0;
    },
    isLastPage() {
      return this.endInterval === this.totalProducts;
    },
  },
};
</script>

<style lang="scss">
  @import "TableUI";
</style>
