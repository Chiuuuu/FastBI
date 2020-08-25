<!-- 8-14 数据模型侧栏 -->
<template>
  <div class="board-model" :style="config.style">
    <div flex="dir:top" style="height:100%">
      <div class="model-header" v-show="config.title.enable">
        <span class="model-span" v-if="modelExpand">{{ config.title.text }}</span>
        <a-icon class="model-icon" :type="modelExpand ? 'menu-unfold' : 'menu-fold'" @click="toCollapse" />
      </div>
      <!-- 操作界面 -->
      <div v-if="modelExpand">
        <div class="model-operation" v-if="model">
          <div class="operation_select">
            <a-select default-value="电视收拾" style="width:90%">
              <a-select-option value="电视收拾">
                电视收拾
              </a-select-option>
              <a-select-option value="添加数据模型">
                <span @click="modelHandle">添加数据模型</span>
                <a-icon type="rollback" style="margin-left:130px" @click="modelHandle" />
              </a-select-option>
            </a-select>
          </div>
          <div class="operation_search">
            <a-input-search placeholder="请输入关键字搜索" style="width:90%" />
          </div>
          <div class="operation_main">
            <div class="operation" flex="dir:top">
              <div class="header">
                <span class="d_h_s">维度</span>
                <a-icon class="dicon" type="plus" />
              </div>
              <b-scrollbar style="height: 100%;">
                <div class="dim_main">
                  <a-collapse v-model="activeKey" :bordered="false">
                    <a-collapse-panel key="1" header="Sheet 1" :style="customStyle">
                      <ul class="filewrap">
                        <li v-for="(item, index) in dimesion"
                            class="filelist"
                            :key="index"
                            draggable="true"
                            @dragstart="dragstart(item, 'dimension', $event)"
                            @dragend="dragsend(item, $event)">
                          <img src="@/assets/images/icon_dimension.png" />
                          {{ item.title }}
                        </li>
                      </ul>
                    </a-collapse-panel>
                    <a-collapse-panel key="2" header="Sheet 2" :style="customStyle">
                      <ul class="filewrap">
                        <li v-for="(item, index) in dimesion" class="filelist"
                            :key="index" draggable="true" @dragstart="dragstart(item, 'dimension', $event)">
                          <img src="@/assets/images/icon_dimension.png" />
                          {{ item.title }}
                        </li>
                      </ul>
                    </a-collapse-panel>
                  </a-collapse>
                </div>
              </b-scrollbar>
            </div>
            <div class="operation" flex="dir:top">
              <div class="header">
                <span class="d_h_s">度量</span>
                <a-icon class="dicon" type="plus" />
              </div>
              <b-scrollbar style="height: 100%;">
                <div class="mea_main">
                  <a-collapse v-model="activeKey">
                    <a-collapse-panel key="3" header="Sheet 1">
                      <ul class="filewrap">
                          <li v-for="(item, index) in measure"
                              class="filelist"
                              :key="index" draggable="true"
                              @dragstart="dragstart(item, 'measure', $event)"
                              @dragend="dragsend(item, $event)">
                            <img src="@/assets/images/icon_measure.png" />
                            {{ item.title }}
                          </li>
                        </ul>
                    </a-collapse-panel>
                  </a-collapse>
                </div>
              </b-scrollbar>
            </div>
          </div>
        </div>
        <!-- 初始界面 -->
        <div class="model-contain" v-else>
          <div class="model-search">
            <a-input-search
              placeholder="搜索数据连接名称"
              style="width:90%;margin-left:15px"
            />
          </div>
          <div class="model-main" flex-box="1">
            <a-collapse v-model="activeKey" :bordered="false">
              <template #expandIcon="props">
                <a-icon
                  type="folder"
                  :rotate="props.isActive ? 0 : 0"
                  style="font-size:16px"
                />
              </template>
              <a-collapse-panel key="1" header="数据看板" :style="customStyle">
                <div style="margin-left:25px">
                  <!-- 暂时写死一个点击事件 -->
                  <p @click="modelHandle">电视统计</p>
                  <p>用户统计</p>
                </div>
              </a-collapse-panel>
              <a-collapse-panel key="2" header="管理驾驶舱" :style="customStyle">
                <div style="margin-left:25px">
                  <p>流失统计</p>
                  <p>收入统计</p>
                </div>
              </a-collapse-panel>
              <a-collapse-panel key="3" header="收视分析" :style="customStyle">
                <div style="margin-left:25px">
                  <p>月度统计</p>
                  <p>年度统计</p>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
const dimesion = [
  {
    title: '国家'
  },
  {
    title: '外部账号性质'
  },
  {
    title: '对公对私'
  },
  {
    title: '开户地市'
  },
  {
    title: '开户日期'
  },
  {
    title: '开户省'
  }
]
const measure = [
  {
    title: '余额1'
  },
  {
    title: '余额2'
  },
  {
    title: '余额3'
  },
  {
    title: '余额4'
  },
  {
    title: '余额5'
  }
]

export default {
  name: 'BoardModel',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dimesion,
      measure,
      customStyle:
        'background: #ffffff;border-radius: 4px;border: 0;overflow: hidden',
      activeKey: ['1', '2', '3'],
      model: false
    }
  },
  computed: {
    ...mapGetters(['modelExpand'])
  },
  methods: {
    // 点击展开收起
    toCollapse() {
      this.$emit('on-toggle', this.modelExpand)
    },
    modelHandle() {
      this.model = !this.model
    },
    // 拖动开始 type 拖拽的字段类型维度或者度量
    dragstart(item, type, event) {
      // if (file === 'dimension') {
      //   event.dataTransfer.setData('dimensionFile', JSON.stringify(item))
      // } else {
      //   event.dataTransfer.setData('measureFile', JSON.stringify(item))
      // }
      item.file = type
      event.dataTransfer.setData('dataFile', JSON.stringify(item))
      this.$store.dispatch('SetDragFile', type)
    },
    // 拖动结束
    dragsend() {
      this.$store.dispatch('SetDragFile', '')
    }
  }
}
</script>
