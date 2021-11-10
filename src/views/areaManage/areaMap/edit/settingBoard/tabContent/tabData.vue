<template>
  <!-- 数据tab页 -->
  <a-collapse :activeKey="['area', 'dot']" :bordered="false">
    <a-collapse-panel key="area" header="片区">

      <!-- 插槽的js-xxx类用于拖拽样式判断 -->
      <DropArea @dropData="getDropData">
        <!-- 片区名称字段 -->
        <div v-if="!getEnumData(1)" data-type="1" class="js-drop-item drop-item">拖入片区名称</div>
        <a-tooltip v-else :title="getEnumData(1).alias">
          <div class="drop-item active">
            <div data-type="1" class="js-drop-item text-over text-area">{{ getEnumData(1).alias }}</div>
            <a-dropdown :trigger="['click', 'contextmenu']">
              <a-icon class="arrow" type="caret-down" />
              <a-menu slot="overlay" @click="handleDeleteField(getEnumData(1), 1)">
                <a-menu-item key="1">移除</a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </a-tooltip>

        <!-- 片区信息字段 -->
        <a-tooltip v-for="item in getEnumData(2)" :key="item.id" :title="item.alias">
          <div class="drop-item active">
            <div data-type="2" class="js-drop-item text-over text-area">{{ item.alias }}</div>
            <a-dropdown :trigger="['click', 'contextmenu']">
              <a-icon class="arrow" type="caret-down" />
              <a-menu slot="overlay" @click="handleDeleteField(item, '2')">
                <a-menu-item key="1">移除</a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </a-tooltip>
        <div data-type="2" class="js-drop-item drop-item">拖入片区信息字段</div>
      </DropArea>

    </a-collapse-panel>
    <a-collapse-panel key="dot" header="标记点">

      <!-- 插槽的js-xxx类用于拖拽样式判断 -->
      <DropArea @dropData="getDropData">
        <!-- 经度字段 -->
        <div v-if="!getEnumData(3)" data-type="3" class="js-drop-item drop-item js-measures">拖入经度</div>
        <a-tooltip v-else :title="getEnumData(3).alias">
          <div class="drop-item active">
            <div data-type="3" class="js-drop-item text-over text-area">{{ getEnumData(3).alias }}</div>
            <a-dropdown :trigger="['click', 'contextmenu']">
              <a-icon class="arrow" type="caret-down" />
              <a-menu slot="overlay" @click="handleDeleteField(getEnumData(3), '3')">
                <a-menu-item key="1">移除</a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </a-tooltip>

        <!-- 纬度字段 -->
        <div v-if="!getEnumData(4)" data-type="4" class="js-drop-item drop-item js-measures">拖入纬度</div>
        <a-tooltip v-else :title="getEnumData(4).alias">
          <div class="drop-item active">
            <div data-type="4" class="js-drop-item text-over text-area">{{ getEnumData(4).alias }}</div>
            <a-dropdown :trigger="['click', 'contextmenu']">
              <a-icon class="arrow" type="caret-down" />
              <a-menu slot="overlay" @click="handleDeleteField(getEnumData(4), '4')">
                <a-menu-item key="1">移除</a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </a-tooltip>

        <!-- 标记点信息字段 -->
        <a-tooltip v-for="item in getEnumData(5)" :key="item.id" :title="item.alias">
          <div data-type="5" class="js-drop-item drop-item active">
            <div class="js-drop-item text-over text-area">{{ item.alias }}</div>
            <a-dropdown :trigger="['click', 'contextmenu']">
              <a-icon class="arrow" type="caret-down" />
              <a-menu slot="overlay"  @click="handleDeleteField(item, '5')">
                <a-menu-item key="1">移除</a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </a-tooltip>
        <div data-type="5" class="js-drop-item drop-item">拖入片区信息字段</div>
      </DropArea>

    </a-collapse-panel>
  </a-collapse>
</template>

<script>
import DropArea from '../dropArea'
export default {
  name: 'tabData',
  inject: ['settingInstance'],
  components: {
    DropArea
  },
  computed: {
    setting() {
      return this.settingInstance.setting
    }
  },
  methods: {
    // 拖入字段区域的枚举值(dataset传值)
    enumDataType(type) {
      switch (+type) {
        case 1:
          return ('area.nameData').split('.')
        case 2:
          return ('area.infoList').split('.')
        case 3:
          return ('dot.longitude').split('.')
        case 4:
          return ('dot.latitude').split('.')
        case 5:
          return ('dot.infoList').split('.')
      }
    },
    // 根据枚举值获取具体对象
    getEnumData(type) {
      const keys = this.enumDataType(type)
      let i = 0
      let result = this.setting
      while (i < keys.length) {
        result = result[keys[i++]]
      }
      return result
    },
    // 放置的字段
    getDropData(data, type) {
      const [k1, k2] = this.enumDataType(type)
      const target = this.setting[k1][k2]
      if (Array.isArray(target)) {
        target.push(data)
      } else {
        // 片区字段替换需要提示
        if (+type === 1 && target) {
          this.$confirm({
            title: '确认提示',
            content: '替换片区名称字段将会删除现有数据，确定要替换吗',
            onOk: () => {
              this.setting[k1][k2] = data
            }
          })
        } else {
          this.setting[k1][k2] = data
        }
      }
    },
    // 删除已拖入的字段
    handleDeleteField(item, type) {
      const [k1, k2] = this.enumDataType(type)
      const target = this.setting[k1][k2]
      if (Array.isArray(target)) {
        const index = target.findIndex(f => f.id === item.id)
        target.splice(index, 1)
      } else {
        // 片区字段替换需要提示
        if (+type === 1) {
          this.$confirm({
            title: '确认提示',
            content: '替换片区名称字段将会删除现有数据，确定要替换吗',
            ok: () => {
              this.setting[k1][k2] = null
            }
          })
        } else {
          this.setting[k1][k2] = null
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
