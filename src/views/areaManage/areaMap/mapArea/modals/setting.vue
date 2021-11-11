<template>
  <!-- 弹窗配置片区样式 -->
  <a-modal v-if="data.setting" :visible="show" :title="data.name" @cancel="handleCloseSetting">
    <template #footer>
      <a-button @click="handleResetSetting">恢复默认设置</a-button>
      <a-button key="back" @click="handleCloseSetting">取消</a-button>
      <a-button type="primary" key="submit" @click="handleSaveSetting"
        >保存</a-button
      >
    </template>

    <!-- 片区配置 -->
    <template v-if="data.setting.polygon">
      <div class="setting-row">
        <div class="setting-label">颜色</div>
        <div class="setting-value">
          <el-color-picker
            v-model="data.setting.polygon.fillColor"
          />
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-label">透明度</div>
        <div class="setting-value">
          <a-input-number
            v-model="data.setting.polygon.fillOpacity"
            :max="1"
            :min="0"
            :step="0.01"
          ></a-input-number>
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-label">边框线型</div>
        <div class="setting-value">
          <a-select v-model="data.setting.polygon.strokeStyle">
            <a-select-option value="solid">实线</a-select-option>
            <a-select-option value="dashed">虚线</a-select-option>
          </a-select>
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-label">边框颜色</div>
        <div class="setting-value">
          <el-color-picker
            v-model="data.setting.polygon.strokeColor"
          />
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-label">边框宽度</div>
        <div class="setting-value">
          <a-input-number
            v-model="data.setting.polygon.strokeWeight"
            :max="20"
            :min="0"
          ></a-input-number>
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-label">标题字体</div>
        <div class="setting-value">
          <el-color-picker
            v-model="data.setting.polygon.titleColor"
          />
          <a-input-number
            v-model="data.setting.polygon.titleFontSize"
            :max="100"
            :min="0"
          ></a-input-number>
        </div>
      </div>
    </template>

    <!-- 标记点配置 -->
    <div v-if="data.setting.marker" class="setting-row">
      <div class="setting-label">片区标记点</div>
      <div class="setting-value">
        <el-color-picker
          v-model="data.setting.marker.fillColor"
        />
      </div>
    </div>
  </a-modal>
</template>

<script>
import { BaseSetting } from '../utils/baseSetting'
import { deepClone } from '@/utils/deepClone'
export default {
  name: 'areaSetting',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    show(newValue, oldValue) {
      this.setting = newValue ? deepClone(this.data) : {}
    }
  },
  data() {
    return {
      setting: {}
    }
  },
  methods: {
    // 点击恢复默认设置
    handleResetSetting() {
      this.setting = BaseSetting
    },
    // 点击取消编辑样式
    handleCloseSetting() {
      this.$emit('update:show', false)
    },
    // 点击保存样式
    handleSaveSetting() {
      this.$emit('save', this.setting)
      this.handleCloseSetting()
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
