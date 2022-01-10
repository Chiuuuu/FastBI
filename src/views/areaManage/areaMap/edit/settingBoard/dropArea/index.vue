<template>
  <div ref="dropArea" class="drop-area" @dragover.stop.prevent>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'areaMapDrop',
  inject: ['settingInstance'],
  data() {
    return {
      dragData: {}
    }
  },
  mounted () {
    const dropArea = this.$refs.dropArea
    dropArea.addEventListener('dragenter', this.handleDragenter)
    dropArea.addEventListener('dragleave', this.handleDragleave)
    dropArea.addEventListener('drop', this.handleDrop)
  },
  beforeDestroy() {
    const dropArea = this.$refs.dropArea
    dropArea.removeEventListener('dragenter', this.handleDrop)
    dropArea.removeEventListener('dragleave', this.handleDragleave)
    dropArea.removeEventListener('drop', this.handleDrop)
  },
  methods: {
    validDom(e) {
      const classList = e.target.classList
      const isMeasures = this.settingInstance.dragField.role === 2
      if (classList.contains('js-drop-item')) {
        if (!isMeasures && classList.contains('js-measures')) return false
        return true
      }
    },
    handleDragenter(e) {
      if (!this.validDom(e)) return
      this.dragData = this.settingInstance.dragField
      e.target.classList.add('over')
    },
    handleDragleave(e) {
      if (!this.validDom(e)) return
      this.dragData = {}
      e.target.classList.remove('over')
    },
    handleDrop(e) {
      if (!this.validDom(e)) return
      e.target.classList.remove('over')
      const dataType = e.target.dataset.type
      this.$emit('dropData', this.dragData, dataType)
    }
  }
}
</script>

<style lang="less" scoped>
@theme-color: #627cff;
@border-color: #d8d8d8;
@deep: ~'>>>';
.drop-area {
  padding: 10px;

  @{deep} .text-over {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  @{deep} .arrow {
    margin-top: 10px;
    margin-left: auto;
    cursor: pointer;
  }

  .drop-item {
    display: flex;
    justify-content: center;
    height: 32px;
    line-height: 32px;
    padding-right: 10px;
    border: 1px solid @border-color;
    border-radius: 4px;

    &:not(:last-child) {
      margin-bottom: 20px;
    }

    &.active,
    &.over {
      background: rgba(98,124,255,.1);
      border: 1px solid @theme-color;
      color: @theme-color;
    }

    @{deep} .text-area {
      flex: 1;
      text-align: center;
      padding-left: 10px;
    }
  }
}
</style>
