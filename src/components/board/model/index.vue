<!-- 8-14 数据模型侧栏 -->
<template>
  <div class="board-model" :style="config.style">
    <div style="height:100%">
      <div class="model-header" v-show="config.title.enable">
        <a-icon class="model-back" v-if="!model" type="arrow-left" @click="model=true" />
        <span class="model-span" v-if="modelExpand">{{ config.title.text }}</span>
        <a-icon class="model-icon" :type="modelExpand ? 'menu-unfold' : 'menu-fold'" @click="toCollapse" />
      </div>
      <!-- 操作界面 -->
      <div v-if="modelExpand" style="height:calc(100% - 150px);">
        <div class="model-operation" v-if="model">
          <div class="operation_select">
            <a-select v-model="modelId" style="width:90%">
              <a-select-option v-for="item in disableItem" :value="item.modelid" :key="item.modelid">
                {{item.modelname}}
              </a-select-option>
              <a-select-option value="添加数据模型">
                <span @click="modelAdd">添加数据模型</span>
                <a-icon type="rollback" style="margin-left:130px" @click="modelAdd" />
              </a-select-option>
            </a-select>
          </div>
          <div class="operation_search">
            {{searchValue}}
            <a-select show-search :value="searchValue" placeholder="请输入关键字搜索"
              style="width:90%" :default-active-first-option="false" :show-arrow="false"
              :filter-option="false" :not-found-content="null"
              @search="handleSearch"
              @change="handleChange"
            >
              <template>
                <a-select-option v-for="d in searchResult" :key="d.id">
                {{ d.name }}
                </a-select-option>
              </template>
            </a-select>
            <!-- <a-input-search placeholder="请输入关键字搜索" style="width:90%" @change="searchChange" /> -->
          </div>
          <!-- 维度度量 -->
          <div class="operation_main">
            <div class="operation" flex="dir:top">
              <div class="header">
                <span class="d_h_s">维度</span>
                <a-icon class="dicon" type="plus" />
              </div>
              <!-- <b-scrollbar style="height: 100%;"> -->
                <div class="mea_main">
                  <a-collapse class="scrollbar" style="height:100%;overflow: scroll;" v-model="dimensionsKey" :bordered="false">
                    <a-collapse-panel v-for="(item, index) in dimensions" :key="String(index)"
                      :header="item[0] ? item[0].tableName : ''" :style="customStyle">
                      <ul class="filewrap">
                        <li v-for="(item2, index2) in item"
                            class="filelist"
                            :class="item2.id===searchSelected?'active':''"
                            :key="index2 + '_'"
                            draggable="true"
                            @click="fileClick(item2.id)"
                            @dragstart="dragstart(item2, 'dimensions', $event)"
                            @dragend="dragsend(item2, $event)"
                            @contextmenu.prevent="showMore(item2)">
                          <img src="@/assets/images/icon_dimension.png" />
                          {{ item2.alias }}
                          <a-dropdown :trigger="['click', 'contextmenu']" v-if="!dimensionsChecked.includes(item2.id)" v-model="item2.showMore">
                            <a-icon class="icon-more" type="caret-down" />
                            <a-menu slot="overlay" @click="changeItem(item2, 2)">
                              <a-menu-item key="3">
                                转为度量
                              </a-menu-item>
                            </a-menu>
                          </a-dropdown>
                        </li>
                      </ul>
                    </a-collapse-panel>
                  </a-collapse>
                </div>
              <!-- </b-scrollbar> -->
            </div>
            <div class="operation scrollbar" flex="dir:top">
              <div class="header">
                <span class="d_h_s">度量</span>
                <a-icon class="dicon" type="plus" />
              </div>
              <!-- <b-scrollbar style="height: 100%;"> -->
                <div class="mea_main">
                  <a-collapse class="scrollbar" style="height:100%;overflow: scroll;" v-model="measuresKey">
                    <a-collapse-panel v-for="(item, index) in measures" :key="String(index)"
                      :header="item[0].tableName" :style="customStyle">
                      <ul class="filewrap">
                          <li v-for="(item2, index2) in item"
                              class="filelist"
                              :class="item2.id===searchSelected?'active':''"
                              :key="index2 + '_'" draggable="true"
                              @click="fileClick(item2.id)"
                              @dragstart="dragstart(item2, 'measures', $event)"
                              @dragend="dragsend(item2, $event)"
                              @contextmenu.prevent="showMore(item2)">
                            <img src="@/assets/images/icon_measure.png" />
                            {{ item2.alias }}
                            <a-dropdown :trigger="['click', 'contextmenu']" v-if="!measuresChecked.includes(item2.id)" v-model="item2.showMore">
                              <a-icon class="icon-more" type="caret-down" />
                              <a-menu slot="overlay" @click="changeItem(item2, 1)">
                                <a-menu-item key="3">
                                  转为维度
                                </a-menu-item>
                              </a-menu>
                            </a-dropdown>
                          </li>
                        </ul>
                    </a-collapse-panel>
                  </a-collapse>
                </div>
              <!-- </b-scrollbar> -->
            </div>
          </div>
        </div>
        <!-- 初始界面 -->
        <div class="model-contain" v-else style="height:100%;">
          <div class="model-search">
            <a-input-search
              placeholder="输入关键字搜索"
              style="width:90%;margin-left:15px"
              @change="modelSearch"
            />
          </div>
          <!-- <b-scrollbar style="height: 100%;"> -->
            <!-- 数据模型列表 -->
            <div class="model-main scrollbar">
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
                    <div style="margin-left:25px;cursor: pointer;">
                      <p @click="modelHandle(item2)" v-for="item2 in item.children" :key="item2.id" :class="disableId.includes(item2.id)?'disable':''">{{item2.name}}</p>
                    </div>
                  </a-collapse-panel>
                </template>
              </a-collapse>
            </div>
          <!-- </b-scrollbar> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { deepClone } from '@/utils/deepClone'
  import debounce from 'lodash/debounce'
  import { menuSearchLoop } from '@/utils/menuSearch'

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
      disableId: [], // 已经选中的数据模型无法点击
      disableItem: [], // 选中的数据模型 供选择列表
      searchValue: undefined, // 搜索的维度度量
      searchList: [], // 维度度量整合成一个数组可供搜索
      searchResult: [], // 维度度量搜索结果列表
      searchSelected: '', // 搜索选中的维度度量
      dimensionsChecked: [], // 选中的维度id
      measuresChecked: [] // 选中的度量id
    }
  },
  computed: {
    ...mapGetters(['modelExpand', 'dataModel', 'screenId', 'selectedModelList', 'currentSelected'])
  },
  watch: {
    selectedModelList: {
      handler(val) {
        if (val.length > 0) {
          if (!this.add) {
            this.modelId = val[0].modelid
            this.getPivoSchemaList(val[0].modelid)
            // this.dimensions = this.transData(val[0].dimensions)
            // this.measures = this.transData(val[0].measures)
            this.model = true
          }
          this.disableItem = val
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
            this.dimensionsChecked = []
            if (this.apiData.dimensions.length > 0) {
              this.apiData.dimensions.map(item => {
                this.dimensionsChecked.push(item.id)
              })
            }
            this.measuresChecked = []
            if (this.apiData.measures.length > 0) {
              this.apiData.measures.map(item => {
                this.measuresChecked.push(item.id)
              })
            }
          }
        }
      },
      deep: true
    },
    modelId(val) {
      if (val) {
        this.getPivoSchemaList(val)
      }
    }
  },
  mounted() {
    this.getModelList()
  },
  methods: {
    // 数据模型搜索
    modelSearch: debounce(function(event) {
      const value = event.target.value
      if (value !== '') {
        this.handleGetSearchList(value)
      } else {
        this.getModelList()
      }
    }, 400),
    handleGetSearchList(value) {
      let result = []
      this.modelList.map(item => {
        const newItem = menuSearchLoop(item, value)
        if (newItem) result.push(newItem)
      })
      this.modelList = result
      console.log('搜索结果', this.modelList)
    },
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
      if (item.fileType !== 0 && !this.disableId.includes(item.id)) {
        this.model = !this.model
        this.$store.dispatch('SetDataModel', item)
        // this.getPivoSchemaList(item.id)
        this.add = true // 点击模型
        this.saveModal(item.id)
        this.disableItem.push(item)
        // this.modelId = item.id
        item.modelname = item.name
        item.modelid = item.id
        this.$store.dispatch('dataModel/setSelectedModelList', this.disableItem)
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
        // this.getScreenData()
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
    // 点击维度度量 取消选中效果
    fileClick(id) {
      if (id === this.searchSelected) {
        this.searchSelected = ''
      }
    },
    // 数据模型列表
    getModelList() {
      this.$server.screenManage.getCatalogList().then(res => {
        if (res.code === 200) {
          res.data.map(item => {
            item.selected = false
            item.showMore = false
          })
          this.modelList = res.data
          // this.modelList = res.data.folders
          // this.modelList = this.modelList.concat(res.data.items)
        }
      })
    },
    // 维度度量搜索
    handleSearch(value) {
      if (value) {
        let result = []
        this.searchList.map(item => {
          if (item.name.includes(value)) {
            result.push(item)
          }
        })
        if (result.length === 0) {
          result = [
            { name: '没有符合的搜索结果', id: 11 }
          ]
        }
        this.searchResult = result
      } else {
        this.searchResult = []
      }
    },
    // 选择搜索的维度度量
    handleChange(value) {
      this.searchSelected = value
    },
    // 右键显示更多
    showMore(item) {
      item.showMore = true
    },
    // 转为维度或者度量
    changeItem(item, num) {
      let params = {
        datamodelId: item.datamodelId,
        pivotschemaId: item.pivotschemaId,
        role: num, // 转成维度传1，转成度量传2
        screenId: this.screenId
      }
      this.$server.screenManage.screenModuleTransform(params).then(res => {
        if (res.code === 200) {
          this.getPivoSchemaList(this.modelId, 2)
        }
      })
    },
    // 维度、度量列表
    getPivoSchemaList(id, type = 1) {
      this.$server.screenManage.getPivoSchemaList(id, this.screenId, type).then(res => {
        if (res.code === 200) {
          res.data.dimensions.map(item => {
            item.showMore = false
          })
          res.data.measures.map(item => {
            item.showMore = false
          })
          let dimensions = res.data.dimensions
          let measures = res.data.measures
          this.dimensions = this.transData(dimensions)
          this.measures = this.transData(measures)
          this.searchList = [
            ...dimensions,
            ...measures
          ]
        }
      })
    },
    transData(data) {
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
