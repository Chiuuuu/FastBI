<template>
  <div v-if="config.title === '直线'">
    <GuiField label="线条颜色">
      <el-color-picker
        :value="config.style.borderColor"
        @change="setStyle($event, 'borderColor')"
      ></el-color-picker>
    </GuiField>
    <GuiField label="线型">
      <a-select
        :value="config.style.borderStyle"
        style="width: 90px"
        size="small"
        @change="setStyle($event, 'borderStyle')"
      >
        <a-select-option value="solid">实线</a-select-option>
        <a-select-option value="dashed">虚线</a-select-option>
        <a-select-option value="dotted">点线</a-select-option>
      </a-select>
    </GuiField>
    <GuiField label="线条宽度">
      <a-input-number :max="maxBorder" :min="0" :value="view.height" @change="setView($event, 'height')" />
    </GuiField>
    <GuiField label="线条阴影">
      <a-switch :checked="config.style.showShadow" @change="setStyle($event, 'showShadow')"></a-switch>
    </GuiField>
    <GuiField label="线条颜色">
      <el-color-picker
        :value="config.style.shadowColor"
        @change="setStyle($event, 'shadowColor')"
      ></el-color-picker>
    </GuiField>
    <GuiField label="旋转角度">
      <a-input-number :min="0" :max="360" :value="view.rotate" @change="setView($event, 'rotate')" />
    </GuiField>
  </div>
  <div v-else-if="config.title === '圆形'">
    <GuiField label="填充颜色">
      <el-color-picker
        :value="config.style.backgroundColor"
        @change="setStyle($event, 'backgroundColor')"
      ></el-color-picker>
    </GuiField>
    <GuiField label="填充透明度">
      <a-input-number
        :value="config.style.opacity"
        size="small"
        :min="0"
        :max="1"
        @change="setStyle($event, 'opacity')"
      ></a-input-number>
    </GuiField>
    <GuiField label="边框颜色">
      <el-color-picker
        :value="config.style.borderColor"
        @change="setStyle($event, 'borderColor')"
      ></el-color-picker>
    </GuiField>
    <GuiField label="边框宽度">
      <a-input-number :max="maxBorder" :min="0" :value="config.style.borderWidth" @change="setStyle($event, 'borderWidth')" />
    </GuiField>
    <GuiField label="边框线型">
      <a-select
        :value="config.style.borderStyle"
        style="width: 90px"
        size="small"
        @change="setStyle($event, 'borderStyle')"
      >
        <a-select-option value="solid">实线</a-select-option>
        <a-select-option value="dashed">虚线</a-select-option>
        <a-select-option value="dotted">点线</a-select-option>
      </a-select>
    </GuiField>
    <!-- <GuiField label="旋转角度">
      <a-input-number :min="0" :max="360" :value="view.rotate" @change="setView($event, 'rotate')" />
    </GuiField> -->
  </div>
  <div v-else-if="config.title === '矩形'">
    <GuiField label="填充颜色">
      <el-color-picker
        :value="config.style.backgroundColor"
        @change="setStyle($event, 'backgroundColor')"
      ></el-color-picker>
    </GuiField>
    <GuiField label="填充透明度">
      <a-input-number
        :value="config.style.opacity"
        size="small"
        :min="0"
        :max="1"
        @change="setStyle($event, 'opacity')"
      ></a-input-number>
    </GuiField>
    <GuiField label="边框颜色">
      <el-color-picker
        :value="config.style.borderColor"
        @change="setStyle($event, 'borderColor')"
      ></el-color-picker>
    </GuiField>
    <GuiField label="圆角大小">
      <a-input-number :value="config.style.borderRadius" @change="setStyle($event, 'borderRadius')" />
    </GuiField>
    <GuiField label="边框宽度">
      <a-input-number :max="maxBorder" :min="0" :value="config.style.borderWidth" @change="setStyle($event, 'borderWidth')" />
    </GuiField>
    <GuiField label="边框线型">
      <a-select
        :value="config.style.borderStyle"
        style="width: 90px"
        size="small"
        @change="setStyle($event, 'borderStyle')"
      >
        <a-select-option value="solid">实线</a-select-option>
        <a-select-option value="dashed">虚线</a-select-option>
        <a-select-option value="dotted">点线</a-select-option>
      </a-select>
    </GuiField>
    <!-- <GuiField label="旋转角度">
      <a-input-number :min="0" :max="360" :value="view.rotate" @change="setView($event, 'rotate')" />
    </GuiField> -->
  </div>
</template>

<script>
import { deepClone } from '../../../../utils/deepClone'
import GuiField from '../gui-field.vue'

export default {
  props: {
    config: {
      type: Object,
      require: true
    },
    view: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      style: {

      }
    }
  },
  computed: {
    maxBorder() {
      const { width, height } = this.$store.getters.currSelected.setting.view
      let res = Math.min(width, height) / 2
      if (this.config.title === '直线') {
        res = 20
      }
      return res > 20 ? 20 : res
    }
  },
  components: {
    GuiField
  },
  methods: {
    // 设置样式
    setStyle(value, key) {
      const config = deepClone(this.config)
      config.style[key] = value
      this.$emit('update:config', config)
      this.$emit('refreshSelf')
    },
    // 设置图形样式
    setView(value, key) {
      const view = deepClone(this.view)
      view[key] = value
      this.$emit('update:view', view)
      this.$emit('refreshBase')
    }
  }
}
</script>

<style lang="less" scoped>
.circle {
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background: #000;
}
</style>
