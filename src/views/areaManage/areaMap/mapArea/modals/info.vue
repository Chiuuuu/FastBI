<template>
  <div :class="['map-area-info', { show }]">
    <div class="map-area-info-title">
      <a-icon class="map-btn-close" type="left" @click="handleCloseSetting"></a-icon>
    </div>
    <div class="map-area-info-content scrollbar">
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
      <template v-else-if="type === 'area'">
        <div class="setting-row">
          <div class="setting-label">片区名称</div>
          <div class="setting-value">{{ data.name }}</div>
        </div>
        <div class="setting-row">
          <div class="setting-label">网格数量</div>
          <div class="setting-value">{{ data.setting ? (data.setting.grid.cnt || 0) : 0 }}</div>
        </div>
      </template>

      <!-- 网格点信息载体 -->
      <template v-else-if="type === 'grid'">
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'areaInfo',
  props: {
    type: {
      type: String,
      default: 'area'
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
.map-area-info {
  position: absolute;
  left: -100%;
  top: 0;
  bottom: 50%;
  width: 400px;
  min-height: 330px;
  transition: left 0.2s linear;
  background: #fff;
  box-shadow: 2px 2px 10px rgba(0,0,0,.2);
  &.show {
    left: 0;
  }

  .map-area-info-title {
    height: 30px;
    border-bottom: 1px solid #efefef;
  }
  .map-area-info-content {
    height: calc(100% - 31px);
    overflow-y: auto;
  }
  .map-btn-close {
    margin-left: 8px;
    margin-top: 8px;
  }
}
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
