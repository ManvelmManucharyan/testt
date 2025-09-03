<template>
  <base-select
    v-model="selectedCity"
    :placeholder="placeholder"
    default-placeholder="selectCityOfResidence"
    container-class="city-select-container"
    label-field="display_name"
    :fetch-items="fetchCities"
    :fetch-item="fetchCity"
    :map-item="mapCity"
  />
</template>

<script>
import { getCities, getCity } from '@/api/cities';
import BaseSelect from './BaseSelect.vue';

export default {
  name: 'CitySelect',
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
    selectedCity: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
  methods: {
    fetchCities(params) {
      return getCities(params);
    },
    fetchCity(id) {
      return getCity(id);
    },
    mapCity(city) {
      return {
        id: city.id,
        display_name: city.display_name,
      };
    },
  },
};
</script>

<style scoped>
.city-select-container {
  width: 100%;
}
</style>
