<template>
  <div :class="computedClass">
    <n-select
      v-model:value="selectedOffers"
      :options="options"
      :label-field="label"
      :value-field="trackBy"
      :clearable="allowEmpty"
      :filterable="searchable"
      :multiple="multiple"
      :loading="isLoading"
      :disabled="isLoading"
      :placeholder="computedPlaceholder"
      :max-tag-count="max"
    />
  </div>
</template>

<script>
import { getOffers } from '@/api/offer';

export default {
  name: 'OfferSelect',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [Array, Object, String, Number],
      default: null,
    },
    allowEmpty: {
      type: Boolean,
      default: true,
    },
    searchable: {
      type: Boolean,
      default: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    max: {
      type: Number,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: 'name',
    },
    trackBy: {
      type: String,
      default: 'id',
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      options: [],
      isLoading: true,
    };
  },
  computed: {
    computedPlaceholder() {
      if (this.isLoading) {
        return this.$t('loading');
      } else {
        return this.placeholder || this.$t('selectOffer');
      }
    },
    selectedOffers: {
      get() {
        if (!this.isLoading) {
          if (this.multiple) {
            if (this.modelValue) {
              if (Array.isArray(this.modelValue)) {
                return this.modelValue;
              } else {
                return this.modelValue.split(',');
              }
            } else {
              return [];
            }
          } else {
            return this.modelValue;
          }
        }
        return null;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
    computedClass() {
      return this.$attrs.class ? this.$attrs.class : 'offer-select-container';
    },
  },
  async created() {
    this.options = await getOffers();
    this.isLoading = false;
  },
};
</script>

<style scoped>
.offer-select-container {
  min-width: 250px;
  max-width: 500px;
}
</style>
