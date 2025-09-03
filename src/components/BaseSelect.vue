<template>
  <div :class="computedClass">
    <n-select
      v-model:value="selectedValue"
      :options="options"
      :label-field="labelField"
      :value-field="valueField"
      :placeholder="computedPlaceholder"
      :loading="isLoading"
      :reset-menu-on-options-change="false"
      :clear-filter-after-select="true"
      clearable
      filterable
      @scroll="handleScroll"
      @search="handleSearch"
      @clear="handleClear"
    />
  </div>
</template>

<script>
export default {
  name: 'BaseSelect',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number, null],
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    defaultPlaceholder: {
      type: String,
      required: true,
    },
    containerClass: {
      type: String,
      default: 'select-container',
    },
    labelField: {
      type: String,
      default: 'name',
    },
    valueField: {
      type: String,
      default: 'id',
    },
    fetchItems: {
      type: Function,
      required: true,
    },
    fetchItem: {
      type: Function,
      required: true,
    },
    mapItem: {
      type: Function,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      options: [],
      isLoading: false,
      limit: 10,
      offset: 0,
      totalCount: 0,
      search: null,
      hasMore: true,
    };
  },
  computed: {
    computedPlaceholder() {
      return this.placeholder || this.$t(this.defaultPlaceholder);
    },
    selectedValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
    computedClass() {
      return this.$attrs.class || this.containerClass;
    },
    optionExists() {
      return this.options.some(
        (option) => option[this.valueField] == this.modelValue,
      );
    },
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        if (newValue) this.ensureSelectedItemInOptions();
      },
    },
  },
  async created() {
    await this.loadItems();
  },
  methods: {
    async ensureSelectedItemInOptions() {
      if (this.modelValue && !this.optionExists) {
        const response = await this.fetchItem(this.modelValue);
        const item = this.mapItem(response);
        this.selectedValue = item[this.valueField];
        this.options = [item, ...this.options];
      }
    },
    async loadItems() {
      if (!this.hasMore || this.isLoading) return;
      this.isLoading = true;
      const response = await this.fetchItems({
        limit: this.limit,
        offset: this.offset,
        search: this.search,
      });

      const items = response.results.map(this.mapItem);

      this.options = [...this.options, ...items];
      this.totalCount = response.count;
      this.offset += this.limit;
      this.hasMore = this.options.length < this.totalCount;
      this.isLoading = false;
      await this.ensureSelectedItemInOptions();
    },
    handleScroll(event) {
      const { scrollTop, offsetHeight, scrollHeight } = event.currentTarget;
      if (scrollTop + offsetHeight >= scrollHeight - 50) {
        this.loadItems();
      }
    },
    handleClear() {
      this.search = null;
      this.selectedValue = null;
      this.limit = 10;
      this.offset = 0;
      this.totalCount = 0;
      this.hasMore = true;
      this.options = [];
      this.loadItems();
    },
    handleSearch(query) {
      this.search = query || null;
      this.limit = 10;
      this.offset = 0;
      this.totalCount = 0;
      this.hasMore = true;
      this.options = [];
      this.loadItems();
    },
  },
};
</script>
