<template>
  <base-select
    v-model="selectedCountry"
    :placeholder="placeholder"
    default-placeholder="selectCitizenship1"
    container-class="country-select-container"
    :fetch-items="fetchCountries"
    :fetch-item="fetchCountry"
    :map-item="mapCountry"
  />
</template>

<script>
import { getCountries, getCountry } from '@/api/cities';
import BaseSelect from './BaseSelect.vue';

export default {
  name: 'CountrySelect',
  components: {
    BaseSelect,
  },
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
  },
  emits: ['update:modelValue'],
  computed: {
    selectedCountry: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
  methods: {
    fetchCountries(params) {
      return getCountries(params);
    },
    fetchCountry(id) {
      return getCountry(id);
    },
    mapCountry(country) {
      return {
        id: country.id,
        name: country.name,
      };
    },
  },
};
</script>

<style scoped>
.country-select-container {
  width: 100%;
}
</style>
