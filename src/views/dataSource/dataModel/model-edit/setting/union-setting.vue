<template>
  <a-modal
    :visible="isShow"
    title="Union"
    :getContainer="() => $parent.$refs.rightBody"
    :mask-closable="false"
    :z-index="500"
    @ok="handleSave"
    @cancel="handleClose"
  >
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-model-item label="表名称" prop="name">
        <a-input v-model="form.name" placeholder="请输入表名称" />
      </a-form-model-item>
    </a-form-model>
    <div
      class="union-list"
      @dragover.prevent.stop
      @drop.stop="handleDrop"
    >
      <div class="union-table" :title="table.name" v-for="(table, index) in unionList" :key="table.id">
        <span>{{ table.name }}</span>
        <a-icon v-if="index !== 0" type="delete"></a-icon>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'unionSetting',
  inject: ['nodeStatus'],
  props: {
    isShow: Boolean,
    unionData: {
      type: [ Object, Array ],
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      form: {
        name: this.unionData.alias
      },
      rules: {
        name: [
          { required: true, message: '请输入表名称' },
          { min: 1, max: 20, message: '长度为1~20' }
        ]
      },
      unionList: []
    }
  },
  watch: {
    isShow: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form.name = this.unionData.alias
          if (Array.isArray(this.unionData)) {
            this.unionList = [].concat(this.unionData)
          } else {
            this.unionList = new Array(this.unionData.getProps())
          }
        }
      }
    }
  },
  methods: {
    handleDrop() {
      const nodeData = this.nodeStatus.dragNode.getProps()
      if (this.unionList.some(item => (item.tableId || item.id) === nodeData.id)) {
        this.$message.error('相同的表无需合并')
      } else {
        this.unionList.push(nodeData)
      }
    },
    handleSave() {
      this.$refs.form.validate((ok) => {
        if (ok) {
          this.handleClose()
        }
      })
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
