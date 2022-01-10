<template>
  <!-- 样式tab页 -->
  <a-collapse :activeKey="['area', 'dot']" :bordered="false">
    <a-collapse-panel key="area" header="片区">
      <div class="line-option">
        <span>鼠标移入提示</span>
        <a-switch v-model="setting.area.tooltip"></a-switch>
      </div>
      <div class="line-break-option">
        <div>显示内容</div>
        <a-select
          style="width:100%"
          v-model="setting.area.tooltipList"
          mode="multiple"
          placeholder="请选择显示内容"
        >
          <a-select-option
            v-for="item in areaOptions"
            :key="item.id"
            :value="item.id"
            >{{ item.alias }}</a-select-option
          >
        </a-select>
      </div>
    </a-collapse-panel>
    <a-collapse-panel key="dot" header="标记点">
      <div class="line-option">
        <span>鼠标移入提示</span>
        <a-switch v-model="setting.dot.tooltip"></a-switch>
      </div>
      <div class="line-break-option">
        <div>显示内容</div>
        <a-select
          style="width:100%"
          v-model="setting.dot.tooltipList"
          mode="multiple"
          placeholder="请选择显示内容"
        >
          <a-select-option
            v-for="item in dotOptions"
            :key="item.id"
            :value="item.id"
            >{{ item.alias }}</a-select-option
          >
        </a-select>
      </div>
    </a-collapse-panel>
  </a-collapse>
</template>

<script>
export default {
  name: 'tabStyle',
  inject: ['settingInstance'],
  computed: {
    setting() {
      return this.settingInstance.setting
    },
    areaOptions() {
      let { nameData, infoList } = this.setting.area
      const result = []
      if (nameData) result.push(nameData)
      return result.concat(infoList)
    },
    dotOptions() {
      let { longitude, latitude, infoList } = this.setting.dot
      const result = []
      if (longitude) result.push(longitude)
      if (latitude) result.push(latitude)
      return result.concat(infoList)
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.line-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
}
.line-break-option {
  line-height: 32px;
}
</style>
