<template>
  <!-- 弹窗配置片区样式 -->
  <a-modal :visible="show" :title="type === 'polygon' ? data.name : '查看标记点'" :footer="null" @cancel="handleCloseSetting">
    <!-- 片区信息载体 -->
    <template v-if="type === 'polygon'">
      <div class="setting-row">
        <div class="setting-label">片区名称</div>
        <div class="setting-value">{{ data.name }}</div>
      </div>
      <!-- <div class="setting-row" v-for="item in setting.fields" :key="item.id">
        <div class="setting-label">{{ item.key }}</div>
        <div class="setting-value">{{ setting.value }}</div>
      </div> -->
    </template>

    <!-- 标记点信息载体 -->
    <template v-if="type === 'marker'">
      <div class="setting-row" v-for="([key, value], index) in Object.entries(data.info)" :key="index">
        <div class="setting-label">{{ key }}</div>
        <div class="setting-value">{{ value }}</div>
      </div>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: 'areaInfo',
  props: {
    type: {
      type: String,
      default: 'polygon'
    },
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {

    }
  },
  methods: {
    // 点击取消编辑样式
    handleCloseSetting() {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="less" scoped>
.setting-row {
  display: flex;
  align-items: center;
  height: 40px;
  width: 100%;
  border-left: 1px solid #efefef;
  border-bottom: 1px solid #efefef;

  .setting-label,
  .setting-value {
    flex: 1;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #efefef;
    border-right: 1px solid #efefef;
  }
}
</style>
