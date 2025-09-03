<template>
  <div :class="computedClass">
    <n-switch
      :title="$t('projectActivityType')"
      size="small"
      @update:value="handleSwitchChange"
    />
    <n-select
      v-model:value="selectedProjects"
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
      :render-label="renderLabel"
    />
  </div>
</template>

<script>
import { h } from 'vue';
import { NIcon } from 'naive-ui';
import { CheckmarkCircleOutline, CloseCircleOutline } from '@vicons/ionicons5';
import { getProjects } from '@/api/project';

export default {
  name: 'ProjectSelect',
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
      activityType: 'active',
    };
  },
  computed: {
    computedPlaceholder() {
      if (this.isLoading) {
        return this.$t('loading');
      } else {
        return this.placeholder || this.$t('selectProject');
      }
    },
    selectedProjects: {
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
      return this.$attrs.class ? this.$attrs.class : 'project-select-container';
    },
  },
  async created() {
    await this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      this.isLoading = true;
      this.options = await getProjects({
        activity_type: this.activityType,
      });
      this.isLoading = false;
    },
    async handleSwitchChange(val) {
      this.activityType = val ? 'all' : 'active';
      this.selectedProjects = this.multiple ? [] : null;
      await this.fetchProjects();
    },
    renderLabel(option) {
      return h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          },
        },
        [
          h(
            NIcon,
            {
              color: option.is_active ? 'green' : 'red',
              size: 20,
            },
            () =>
              h(option.is_active ? CheckmarkCircleOutline : CloseCircleOutline),
          ),
          h('span', option[this.label]),
        ],
      );
    },
  },
};
</script>

<style scoped>
.project-select-container {
  min-width: 250px;
  max-width: 500px;
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 5px;
}
</style>
