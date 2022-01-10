<template>
  <!-- 弹窗配置片区样式 -->
  <a-modal
    :visible="show"
    :title="type === 'polygon' ? data.name : '查看网格点'"
    :getContainer="getContainer"
    :footer="null"
    @cancel="handleCloseSetting"
    >
    <!-- 分公司信息载体 -->
    <template v-if="type === 'company'">
      <div class="setting-row">
        <div class="setting-label">公司名称</div>
        <div class="setting-value">{{ data.name }}</div>
      </div>
      <div class="setting-row">
        <div class="setting-label">{{ data.name === '从化' || data.name === '增城' ? '网格数量' : '片区数量' }}</div>
        <div class="setting-value">{{ data.areaCnt || 0 }}</div>
      </div>
    </template>

    <!-- 片区信息载体 -->
    <template v-if="type === 'polygon'">
      <div class="setting-row">
        <div class="setting-label">片区名称</div>
        <div class="setting-value">{{ data.name }}</div>
      </div>
      <div class="setting-row">
        <div class="setting-label">网格数量</div>
        <div class="setting-value">{{ data.setting ? (data.setting.marker.cnt || 0) : 0 }}</div>
      </div>
    </template>

    <!-- 网格点信息载体 -->
    <template v-if="type === 'marker'">
      <div class="setting-row">
        <div class="setting-label">网格名称</div>
        <div class="setting-value">{{ data.grid || '' }}</div>
      </div>
      <div class="setting-row">
        <div class="setting-label">街道名称</div>
        <div class="setting-value">{{ data.street || '' }}</div>
      </div>
      <div class="setting-row">
        <div class="setting-label">楼盘名称</div>
        <div class="setting-value">{{ data.communityName || '' }}</div>
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
    // 窗口挂载对象
    getContainer() {
      return document.querySelector('#mapArea')
    },
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
  // height: 40px;
  width: 100%;
  border: 1px solid #efefef;

  .setting-label,
  .setting-value {
    flex: 1;
    // height: 40px;
    padding: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .setting-value {
    border-left: 1px solid #efefef;
  }
}
</style>
