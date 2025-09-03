<template>
  <div class="file-upload-table">
    <table>
      <thead>
        <tr>
          <th>{{ $t('documents') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(file, index) in files" :key="index">
          <td>
            <div v-if="file.document">
              <a style="cursor: pointer" @click.prevent="handleDownload(file)">
                {{ file.document.split('/').pop() }}
              </a>
            </div>
            <input
              v-else
              type="file"
              :accept="acceptedFileTypes"
              @change="(event) => handleFileUpload(event, index)"
            />
          </td>
          <td class="buttons">
            <button class="delete-btn" @click="handleRemove(index)">
              {{ $t('delete') }}
            </button>
            <slot
              name="actions"
              :file="file"
              :index="index"
              :handle-save="() => handleSave(file, index)"
            >
              <n-button
                v-if="!file.document && file.name"
                @click="handleSave(file, index)"
              >
                {{ $t('save') }}
              </n-button>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    <n-button class="add-btn" @click="handleAdd">
      {{ $t('addAnotherDocument') }}
    </n-button>
  </div>
</template>

<script>
export default {
  name: 'FileUploadTable',
  props: {
    files: {
      type: Array,
      required: true,
    },
    acceptedFileTypes: {
      type: String,
      default: '*/*',
    },
    onUpload: {
      type: Function,
      required: true,
    },
    onRemove: {
      type: Function,
      required: true,
    },
    onDownload: {
      type: Function,
      required: true,
    },
  },
  emits: ['update:files', 'file-added', 'file-removed', 'file-uploaded'],
  methods: {
    handleFileUpload(event, index) {
      const file = event.target.files[0];
      const updatedFiles = [...this.files];
      updatedFiles[index] = file;
      this.$emit('update:files', updatedFiles);
    },
    handleAdd() {
      const updatedFiles = [...this.files, {}];
      this.$emit('update:files', updatedFiles);
      this.$emit('file-added');
    },
    async handleRemove(index) {
      await this.onRemove(index);
      this.$emit('file-removed', index);
    },
    async handleSave(file, index) {
      const updatedFiles = [...this.files];
      updatedFiles.splice(index, 1, {});
      this.$emit('update:files', updatedFiles);
      await this.onUpload(file, index);
      this.$emit('file-uploaded', { file, index });
    },
    handleDownload(file) {
      this.onDownload(file);
    },
  },
};
</script>

<style scoped>
.file-upload-table {
  width: 100%;
  margin-top: 20px;
  font-family: Arial, sans-serif;
  background-color: #fafafa;
  border-radius: 8px;
  padding: 15px;
}
table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}
th,
td {
  padding: 14px;
  border: 1px solid #e1e1e1;
  text-align: left;
}
th {
  background-color: #f4f4f4;
  color: #333;
  font-weight: 600;
  font-size: 16px;
  width: 85%;
}
td {
  background-color: #fff;
  color: #555;
  font-size: 14px;
  vertical-align: middle;
}
.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 10px;
  cursor: pointer;
  border-radius: 2px;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
  margin-right: 10px;
  font-size: 14px;
}

.delete-btn:hover {
  background-color: #c0392b;
}

.add-btn {
  margin-top: 20px;
}

input[type='file'] {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  background-color: #f9f9f9;
  width: 90%;
}
input[type='file']::-webkit-file-upload-button {
  background-color: #20618b;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.buttons {
  border: none;
}
</style>
