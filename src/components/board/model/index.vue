<!-- 8-14 数据模型侧栏 -->
<template>
  <div class="board-model" :style="config.style">
    <div style="height:100%">
      <div class="model-header" v-show="config.title.enable">
        <span class="model-span" v-if="modelExpand">{{ config.title.text }}</span>
        <a-icon class="model-icon" :type="modelExpand ? 'menu-unfold' : 'menu-fold'" @click="toCollapse" />
      </div>
      <!-- 操作界面 -->
      <div v-if="modelExpand" style="height:calc(100% - 150px);">
        <div class="model-operation" v-if="model">
          <div class="operation_select">
            <a-select v-model="modelId" style="width:90%" @change="modelChange">
              <!-- <a-select-option :value="dataModel.id">
                {{dataModel.name}}
              </a-select-option> -->
              <a-select-option v-for="item in selectedModelList" :value="item.modelid" :key="item.modelid">
                {{item.modelname}}
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
                  <a-collapse v-model="dimensionsKey" :bordered="false">
                    <a-collapse-panel v-for="(item, index) in dimensions" :key="String(index)"
                      :header="item[0] ? item[0].tableName : ''" :style="customStyle">
                      <ul class="filewrap">
                        <li v-for="(item2, index2) in item"
                            class="filelist"
                            :key="index2 + '_'"
                            draggable="true"
                            @dragstart="dragstart(item2, 'dimensions', $event)"
                            @dragend="dragsend(item2, $event)">
                          <img src="@/assets/images/icon_dimension.png" />
                          {{ item2.name }}
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
                  <a-collapse v-model="measuresKey">
                    <a-collapse-panel v-for="(item, index) in measures" :key="String(index)"
                      :header="item[0].tableName" :style="customStyle">
                      <ul class="filewrap">
                          <li v-for="(item2, index2) in item"
                              class="filelist"
                              :key="index2 + '_'" draggable="true"
                              @dragstart="dragstart(item2, 'measures', $event)"
                              @dragend="dragsend(item2, $event)">
                            <img src="@/assets/images/icon_measure.png" />
                            {{ item2.name }}
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
        <div class="model-contain" v-else style="height:100%;">
          <div class="model-search">
            <a-input-search
              placeholder="搜索数据接入名称"
              style="width:90%;margin-left:15px"
            />
          </div>
          <b-scrollbar style="height: 100%;">
            <div class="model-main">
              <a-collapse v-model="modelKey" :bordered="false">
                <template #expandIcon="props">
                  <a-icon
                    type="folder"
                    :rotate="props.isActive ? 0 : 0"
                    style="font-size:16px"
                  />
                </template>
                <template v-for="(item, index) in modelList">
                  <a-collapse-panel :showArrow="Boolean(item.fileType === 0)"
                  :key="String(index)"
                  :header="item.name"
                  :style="customStyle"
                  :class="disableId.includes(item.id)?'disable':''"
                  @click.native="modelHandle(item)">
                    <div style="margin-left:25px;cursor: pointer;" >
                      <p @click="modelHandle(item2)" v-for="item2 in item.children" :key="item2.id" :class="disableId.includes(item2.id)?'disable':''">{{item2.name}}</p>
                    </div>
                  </a-collapse-panel>
                </template>
              </a-collapse>
            </div>
          </b-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { deepClone } from '@/utils/deepClone'
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
      customStyle:
        'background: #ffffff;border-radius: 4px;border: 0;overflow: hidden;color:red !important;',
      modelKey: ['0', '1', '2', '3', '4', '5', '6', '7'],
      dimensionsKey: ['0', '1', '2', '3'], // 默认展开
      measuresKey: ['0', '1', '2', '3'],
      model: false,
      modelList: [], // 数据模型列表
      dimensions: [], // 维度列表
      measures: [], // 度量列表
      modelId: '',
      disableId: [] // 已经选中的数据模型无法点击
    }
  },
  computed: {
    ...mapGetters(['modelExpand', 'dataModel', 'screenId', 'selectedModelList', 'currentSelected'])
  },
  watch: {
    selectedModelList: {
      handler(val) {
        console.log(val)
        if (val.length > 0) {
          if (!this.add) {
            this.modelId = val[0].modelid
            this.getPivoSchemaList(val[0].modelid)
            // this.dimensions = this.transData(val[0].dimensions)
            // this.measures = this.transData(val[0].measures)
            this.model = true
          }
          val.map(item => {
            this.disableId.push(item.modelid)
          })
        }
      },
      deep: true
    },
    currentSelected: {
      handler(val) {
        if (val) {
          if (val.packageJson.api_data) {
            this.apiData = deepClone(val.packageJson.api_data)
            if (this.apiData.modelId) {
              this.modelId = this.apiData.modelId
            }
          }
        }
      },
      deep: true
    }
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
    modelChange(val) {
      this.getPivoSchemaList(val)
      // this.selectedModelList.map(item => {
      //   if (item.modelid === val) {
      //     this.dimensions = this.transData(item.dimensions)
      //     this.measures = this.transData(item.measures)
      //   }
      // })
    },
    // 点击选中模型
    modelHandle(item) {
      if (item.fileType !== 0 && !this.disableId.includes(item.id)) {
        this.model = !this.model
        this.$store.dispatch('SetDataModel', item)
        this.getPivoSchemaList(item.id)
        this.add = true // 点击模型
        this.saveModal(item.id)
        this.modelId = item.id
      }
    },
    // 获取大屏数据
    getScreenData() {
      this.$server.screenManage.getScreenDetailById(this.screenId).then(res => {
        if (res.code === 200) {
          this.$store.dispatch('dataModel/setSelectedModelList', res.list)
        }
      })
    },
    // 保存选中的模型
    saveModal(id) {
      let params = {
        datamodelId: id,
        screenId: this.screenId
      }
      this.$server.screenManage.screenModuleSave({ params }).then(res => {
        console.log(res)
        this.getScreenData()
        this.modelId = id
      })
    },
    // 拖动开始 type 拖拽的字段类型维度或者度量
    dragstart(item, type, event) {
      item.modelId = this.modelId
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
      this.$server.screenManage.getCatalogList().then(res => {
        if (res.code === 200) {
          res.data.map(item => {
            item.selected = false
          })
          this.modelList = res.data
          // this.modelList = res.data.folders
          // this.modelList = this.modelList.concat(res.data.items)
        }
      })
    },
    // 维度、度量列表
    getPivoSchemaList(id) {
      this.$server.screenManage.getPivoSchemaList(id).then(res => {
        if (res.code === 200) {
          let dimensions = res.data.dimensions
          let measures = res.data.measures
          this.dimensions = this.transData(dimensions)
          this.measures = this.transData(measures)
        }
      })
    },
    transData(data) {
      // const data = [{ name: 'xiaoming', round: 1 }, { name: 'xiaowang', round: 1 }, { name: 'xiaoli', round: 2 }, { name: 'xiaowang', round: 3 }]
      const result = Object.values(
          data.reduce((obj, cur) => {
              if (obj[cur.tableNo]) {
                  Object.prototype.toString.call(obj[cur.tableNo]) === '[object Array]' ? obj[cur.tableNo].push(cur) : (obj[cur.tableNo] = [obj[cur.tableNo], cur])
              } else {
                  obj[cur.tableNo] = [cur]
              }
              return obj
          }, {})
      )
      return result
    }
  }
}
</script>

<style lang="stylus">
.ant-collapse >  .customStyle > .ant-collapse-header{
  color:#ccc;
}
.disable, .disable .ant-collapse-header{
  color:#ccc !important;
}
</style>
