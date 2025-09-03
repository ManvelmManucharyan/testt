<template>
  <div ref="dropdown" class="dropdown" @click.stop="toggleDropdown">
    <button class="dropdown-button">
      <slot name="activator"></slot>
    </button>
    <div
      v-if="currentSelectedDate === `${day}.${month}`"
      class="dropdown-menu"
      :style="{ minWidth: nudgeWidth + 'px' }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nudgeWidth: {
      type: Number,
      default: 200,
    },
    day: Number,
    month: Number,
    currentSelectedDate: String,
  },
  emits: ['update:date'],
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    toggleDropdown() {
      if (this.currentSelectedDate === `${this.day}.${this.month}`) {
        this.closeDropdown();
      } else {
        this.$emit('update:date', `${this.day}.${this.month}`);
      }
    },
    closeDropdown() {
      this.$emit('update:date', null);
    },
    handleClickOutside(event) {
      if (!this.$refs.dropdown) return;

      if (!this.$refs.dropdown.contains(event.target)) {
        this.closeDropdown();
      }
    },
  },
};
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
  text-align: center;
}

.dropdown-button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  border-radius: 4px;
}
</style>
