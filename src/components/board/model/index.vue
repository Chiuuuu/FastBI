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
            <a-select :default-value="dataModel.id" style="width:90%">
              <a-select-option :value="dataModel.id">
                {{dataModel.name}}
              </a-select-option>
              <a-select-option value="添加数据模型">
                <span @click="modelAdd">添加数据模型</span>
                <a-icon type="rollback" style="margin-left:130px" @click="modelAdd" />
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
                    <a-collapse-panel v-for="(item, index) in dimensions" :key="index"
                      :header="item[0].tableName" :style="customStyle">{{typeof(index)}}
                      <ul class="filewrap">
                        <li v-for="(item2, index2) in item"
                            class="filelist"
                            :key="index2 + '_'"
                            draggable="true"
                            @dragstart="dragstart(item2, 'dimension', $event)"
                            @dragend="dragsend(item2, $event)">
                          <img src="@/assets/images/icon_dimension.png" />
                          {{ item2.field }}
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
                    <a-collapse-panel v-for="(item, index) in measures" :key="index"
                      :header="item[0].tableName" :style="customStyle">
                      <ul class="filewrap">
                          <li v-for="(item2, index2) in item"
                              class="filelist"
                              :key="index2 + '_'" draggable="true"
                              @dragstart="dragstart(item2, 'measure', $event)"
                              @dragend="dragsend(item2, $event)">
                            <img src="@/assets/images/icon_measure.png" />
                            {{ item2.field }}
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
              <a-collapse-panel v-for="(item, index) in modelList" :key="index" :header="item.name" :style="customStyle">
                <div style="margin-left:25px">
                  <p @click="modelHandle(item2)" v-for="item2 in item.items" :key="item2.id">{{item2.name}}</p>
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
        'background: #ffffff;border-radius: 4px;border: 0;overflow: hidden;',
      activeKey: [0, 1, 2, 3],
      model: false,
      modelList: [], // 数据模型列表
      dimensions: [], // 维度列表
      measures: [] // 度量列表
    }
  },
  computed: {
    ...mapGetters(['modelExpand', 'dataModel'])
  },
  mounted() {
    this.getModelList()
  },
  methods: {
    // 点击展开收起
    toCollapse() {
      this.$emit('on-toggle', this.modelExpand)
    },
    // 添加数据模型
    modelAdd() {
      this.model = !this.model
    },
    // 点击选中模型
    modelHandle(item) {
      this.model = !this.model
      this.$store.dispatch('SetDataModel', item)
      this.getPivoSchemaList()
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
    },
    // 数据模型列表
    getModelList() {
      this.$server.screenManage.catalogList().then(res => {
        if (res.data.code === 200) {
          this.modelList = res.data.data.folders
        }
      })
    },
    // 维度、度量列表
    getPivoSchemaList() {
      this.$server.screenManage.getPivoSchemaList(this.dataModel.id).then(res => {
        if (res.data.code === 200) {
          let dimensions = res.data.data.dimensions
          let measures = res.data.data.measures
          this.dimensions = this.transData(dimensions)
          this.measures = this.transData(measures)
        }
      })
    },
    transData(data) {
      // const data = [{ name: 'xiaoming', round: 1 }, { name: 'xiaowang', round: 1 }, { name: 'xiaoli', round: 2 }, { name: 'xiaowang', round: 3 }]
      const result = Object.values(
          data.reduce((obj, cur) => {
            console.log(obj)
              if (obj[cur.tableNo]) {
                  Object.prototype.toString.call(obj[cur.tableNo]) === '[object Array]' ? obj[cur.tableNo].push(cur) : (obj[cur.tableNo] = [obj[cur.tableNo], cur])
              } else {
                  obj[cur.tableNo] = [cur]
              }
              return obj
          }, {})
      )
      console.log(result)
      return result
    }
  }
}
</script>
